const Notification = require("../models/Notification");
const { getIO } = require("../socket");
const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.userId;
    const { userId: receiverId } = req.params;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        message: "You cannot send a friend request to yourself",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyFriends = receiver.friends.includes(senderId);

    if (alreadyFriends) {
      return res.status(400).json({
        message: "You are already friends",
      });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Friend request already sent",
      });
    }

    const reverseRequest = await FriendRequest.findOne({
      sender: receiverId,
      receiver: senderId,
      status: "pending",
    });

    if (reverseRequest) {
      return res.status(400).json({
        message: "This user already sent you a friend request",
      });
    }

    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    const notification = await Notification.create({
  recipient: receiverId,
  sender: senderId,
  type: "friend_request",
  message: "You received a new friend request",
});

 const populatedNotification = await notification.populate(
  "sender",
  "name email profilePicture"
 );

 getIO().emit("newNotification", populatedNotification);

    const populatedRequest = await request.populate([
      { path: "sender", select: "name email profilePicture" },
      { path: "receiver", select: "name email profilePicture" },
    ]);

    res.status(201).json({
      message: "Friend request sent successfully",
      request: populatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        message: "Friend request not found",
      });
    }

    if (request.receiver.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You can only accept requests sent to you",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Friend request is no longer pending",
      });
    }

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.receiver },
      
    });

    await User.findByIdAndUpdate(request.receiver, {
      $addToSet: { friends: request.sender },
    });
    
    const notification = await Notification.create({
  recipient: request.sender,
  sender: request.receiver,
  type: "friend_accept",
  message: "Your friend request was accepted",
});

const populatedNotification = await notification.populate(
  "sender",
  "name email profilePicture"
);

getIO().emit("newNotification", populatedNotification);

    res.json({
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        message: "Friend request not found",
      });
    }

    if (request.receiver.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You can only reject requests sent to you",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Friend request is no longer pending",
      });
    }

    request.status = "rejected";
    await request.save();

    res.json({
      message: "Friend request rejected successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.userId,
      status: "pending",
    })
      .populate("sender", "name email profilePicture bio")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
};