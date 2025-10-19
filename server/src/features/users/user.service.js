import ApiError from "../../shared/utils/apiError.util.js";
import FriendRequest from "./friendRequest.model.js";
import User from "./user.model.js";

export async function recommendUsers(userId) {
  const currentUser = await User.findById(userId).select("friends role");
  const excludedFriendIds = currentUser?.friends || [];

  // If current user is super_admin, show all users
  // If current user is admin, only show other admins
  // If current user is regular user, exclude all admins and super_admins
  let roleFilter;
  if (currentUser?.role === "super_admin") {
    roleFilter = {}; // Show all users
  } else if (currentUser?.role === "admin") {
    roleFilter = { role: "admin" }; // Only show other admins
  } else {
    roleFilter = { role: { $nin: ["admin", "super_admin"] } }; // Exclude admins and super_admins
  }

  return await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: excludedFriendIds } },
      { isVerified: true },
      { isOnboarded: true },
      roleFilter,
    ],
  });
}

export async function myFriends(userId) {
  const user = await User.findById(userId)
    .select("friends")
    .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

  return user.friends;
}

export async function sendRequest(userData) {
  const { myId, recipientId } = userData;
  if (myId === recipientId) {
    throw new ApiError("You can't send friend request to yourself", 400);
  }

  const currentUser = await User.findById(myId).select(
    "fullName email role nativeLanguage learningLanguage profilePic"
  );

  const recipient = await User.findById(recipientId);

  if (!recipient) {
    throw new ApiError("Recipient not found", 404);
  }

  // Prevent regular users from sending requests to admins and super_admins
  if (
    currentUser?.role === "user" &&
    (recipient.role === "admin" || recipient.role === "super_admin")
  ) {
    throw new ApiError(
      "You cannot send friend requests to administrators",
      403
    );
  }

  // Prevent admins from sending requests to super_admins
  if (currentUser?.role === "admin" && recipient.role === "super_admin") {
    throw new ApiError(
      "You cannot send friend requests to super administrators",
      403
    );
  }

  if (recipient.friends.includes(myId)) {
    throw new ApiError("You are already friends with this user", 400);
  }

  const existingRequest = await FriendRequest.findOne({
    $or: [
      { sender: myId, recipient: recipientId },
      { sender: recipientId, recipient: myId },
    ],
  });

  if (existingRequest) {
    throw new ApiError(
      "A friend request already exists between you and this user",
      400
    );
  }

  const friendRequest = await FriendRequest.create({
    sender: myId,
    recipient: recipientId,
  });

  const emailData = {
    recipientEmail: recipient.email,
    recipientName: recipient.fullName,
    senderName: currentUser.fullName,
    senderNativeLanguage: currentUser.nativeLanguage,
    senderLearningLanguage: currentUser.learningLanguage,
  };

  return { friendRequest, emailData };
}

export async function acceptRequest(requestData) {
  const { requestId, userId } = requestData;
  const friendRequest = await FriendRequest.findById(requestId);

  if (!friendRequest) {
    throw new ApiError("Friend request not found", 404);
  }

  if (friendRequest.recipient.toString() !== userId) {
    throw new ApiError("You are not authorized to accept this request", 403);
  }

  friendRequest.status = "accepted";
  await friendRequest.save();

  await User.findByIdAndUpdate(friendRequest.sender, {
    $addToSet: { friends: friendRequest.recipient },
  });

  await User.findByIdAndUpdate(friendRequest.recipient, {
    $addToSet: { friends: friendRequest.sender },
  });
}

export async function processFriendRequest(userId) {
  const incomingReqs = await FriendRequest.find({
    recipient: userId,
    status: "pending",
  }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

  const acceptedReqs = await FriendRequest.find({
    sender: userId,
    status: "accepted",
  }).populate("recipient", "fullName profilePic");

  return { incomingReqs, acceptedReqs };
}

export async function outgoingRequests(userId) {
  const requests = await FriendRequest.find({
    sender: userId,
    status: "pending",
  }).populate(
    "recipient",
    "fullName profilePic nativeLanguage learningLanguage"
  );

  return requests.filter((req) => req.recipient !== null);
}

export async function updateProfile(userId, profileData) {
  const allowedFields = [
    "fullName",
    "bio",
    "nativeLanguage",
    "learningLanguage",
    "location",
    "profilePic",
  ];
  const updateData = {};

  for (const field of allowedFields) {
    if (profileData[field] !== undefined) {
      updateData[field] = profileData[field];
    }
  }

  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) throw new ApiError("User not found", 404);
  return user;
}

export async function changePassword(userId, passwordData) {
  const { currentPassword, newPassword } = passwordData;

  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError("User not found", 404);

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError("Current password is incorrect", 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
}
