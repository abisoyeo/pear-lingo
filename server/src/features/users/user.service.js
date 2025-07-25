import ApiError from "../../shared/utils/apiError.util.js";
import FriendRequest from "./friendRequest.model.js";
import User from "./user.model.js";

export async function recommendUsers(userData) {
  const excludedFriendIds = userData.currentUser?.friends || [];

  return await User.find({
    $and: [
      { _id: { $ne: userData.currentUserId } },
      { _id: { $nin: excludedFriendIds } },
      { isOnboarded: true },
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
  // prevent sending req to yourself
  if (myId === recipientId) {
    throw new ApiError("You can't send friend request to yourself", 400);
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    throw new ApiError("Recipient not found", 404);
  }

  // check if user is already friends
  if (recipient.friends.includes(myId)) {
    throw new ApiError("You are already friends with this user", 400);
  }

  // check if a req already exists
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

  return friendRequest;
}

export async function acceptRequest(requestId) {
  const friendRequest = await FriendRequest.findById(requestId);

  if (!friendRequest) {
    throw new ApiError("Friend request not found", 404);
  }

  // Verify the current user is the recipient
  if (friendRequest.recipient.toString() !== req.user.id) {
    throw new ApiError("You are not authorized to accept this request", 403);
  }

  friendRequest.status = "accepted";
  await friendRequest.save();

  // add each user to the other's friends array
  // $addToSet: adds elements to an array only if they do not already exist.
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
  const myOutgoingRequests = await FriendRequest.find({
    sender: userId,
    status: "pending",
  }).populate(
    "recipient",
    "fullName profilePic nativeLanguage learningLanguage"
  );

  return myOutgoingRequests;
}
