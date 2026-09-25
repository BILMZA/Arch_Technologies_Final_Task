// this file handles the logic for creating and retrieving comments
const Notification = require("../models/Notification");
const { getIO } = require("../socket");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.userId,
      content: content.trim(),
    });

    const populatedComment = await comment.populate(
      "author",
      "name email profilePicture"
    );
    getIO().emit("newComment", populatedComment);

    // Create notification for the post owner
    if (post.author.toString() !== req.userId.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.userId,
        type: "comment",
        message: "Someone commented on your post",
      });

      const populatedNotification = await notification.populate(
        "sender",
        "name email profilePicture"
      );

      getIO().emit("newNotification", populatedNotification);
    }

    res.status(201).json({
      message: "Comment created successfully",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comments = await Comment.find({ post: postId })
      .populate("author", "name email profilePicture")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createComment,
  getComments,
};