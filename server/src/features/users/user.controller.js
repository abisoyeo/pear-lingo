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
    const userId = req.user.id;

    const recommendedUsers = await recommendUsers(userId);

    sendResponse(
      res,
      200,
      "Recommended users gotten successfully",
      recommendedUsers
    );
  } catch (error) {
    next(error);
  }
}

export async function getMyFriends(req, res, next) {
  try {
    const userId = req.user.id;
    const friends = await myFriends(userId);

    sendResponse(res, 200, "Your friends gotten successfully", friends);
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
    const friendRequest = await sendRequest(userData);

    sendResponse(res, 201, "Friend Request Sent", friendRequest);
  } catch (error) {
    next(error);
  }
}

export async function acceptFriendRequest(req, res, next) {
  try {
    const requestData = {
      requestId: req.params.id,
      userId: req.user.id,
    };
    await acceptRequest(requestData);
    sendResponse(res, 200, "Friend request accepted");
  } catch (error) {
    next(error);
  }
}

export async function getFriendRequests(req, res, next) {
  try {
    const { incomingReqs, acceptedReqs } = await processFriendRequest(
      req.user.id
    );

    sendResponse(
      res,
      200,
      "Incoming and accepted friend requests fetched successfully",
      { incomingReqs, acceptedReqs }
    );
  } catch (error) {
    next(error);
  }
}

export async function getOutgoingFriendRequests(req, res, next) {
  try {
    const myOutgoingRequests = await outgoingRequests(req.user.id);

    sendResponse(
      res,
      200,
      "Outgoing friend requests fetched successfully",
      myOutgoingRequests
    );
  } catch (error) {
    next(error);
  }
}
