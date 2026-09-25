const express = require("express");

const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
} = require("../controllers/friendRequestController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Must be registered BEFORE /:userId to avoid "pending" being treated as a userId
router.get("/pending", protect, getPendingRequests);

router.post("/:userId", protect, sendFriendRequest);

router.post("/:requestId/accept", protect, acceptFriendRequest);

router.post("/:requestId/reject", protect, rejectFriendRequest);

module.exports = router;