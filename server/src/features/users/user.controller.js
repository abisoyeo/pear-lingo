import User from "./user.model.js";
import FriendRequest from "./friendRequest.model.js";
import {
  acceptRequest,
  myFriends,
  outgoingRequests,
  processFriendRequest,
  recommendUsers,
  sendRequest,
} from "./user.service.js";
import sendResponse from "../../shared/utils/sendResponse.util.js";

export async function getRecommendedUsers(req, res, next) {
  try {
    const userData = { currentUserId: req.user.id, currentUser: req.user };

    const recommendedUsers = recommendUsers(userData);

    res.status(200).json(recommendedUsers);

    // He mentioned something about responses matching the tutorial cos of future errors in FE so take note
    // sendResponse(
    //   res,
    //   200,
    //   "Recommended users gotten successfully",
    //   recommendedUsers
    // );
  } catch (error) {
    next(error);
  }
}

export async function getMyFriends(req, res, next) {
  try {
    const userId = req.user.id;
    const friends = myFriends(userId);

    res.status(200).json(friends);
    // sendResponse(res, 200, "Your friends gotten successfully", friends);
  } catch (error) {
    next(error);
  }
}

export async function sendFriendRequest(req, res, next) {
  try {
    const userData = {
      myId: req.user.id,
      recipientId: req.params.id,
    };
    const friendRequest = sendRequest(userData);
    res.status(201).json(friendRequest);
    // sendResponse(res, 201, "Friend Request Sent", friendRequest);
  } catch (error) {
    next(error);
  }
}

export async function acceptFriendRequest(req, res, next) {
  try {
    acceptRequest(req.params.id);
    res.status(200).json({ message: "Friend request accepted" });
    //   sendResponse(res, 200, "Friend request accepted");
  } catch (error) {
    next(error);
  }
}

export async function getFriendRequests(req, res, next) {
  try {
    const { incomingReqs, acceptedReqs } = processFriendRequest(req.user.id);

    res.status(200).json({ incomingReqs, acceptedReqs });
    //   sendResponse(res, 200, "", { incomingReqs, acceptedReqs });
  } catch (error) {
    next(error);
  }
}

export async function getOutgoingFriendRequests(req, res, next) {
  try {
    const myOutgoingRequests = outgoingRequests(req.user.id);
    res.status(200).json(myOutgoingRequests);
    //   sendResponse(res,200,"",myOutgoingRequests)
  } catch (error) {
    next(error);
  }
}
