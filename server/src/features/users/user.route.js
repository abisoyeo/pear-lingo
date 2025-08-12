import express from "express";
import {
  protectRoute,
  requireVerifiedAndOnboardedUser,
} from "../auth/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendRequests,
  getRecommendedUsers,
  sendFriendRequest,
  updateUserProfile,
} from "./user.controller.js";
const router = express.Router();

router.use(protectRoute, requireVerifiedAndOnboardedUser);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

// Profile management routes
router.put("/profile", updateUserProfile);

export default router;
