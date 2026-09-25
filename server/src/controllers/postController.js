//this file will define the post controller for the social network application
//in easy terms, this file will handle the logic for creating, retrieving, and liking posts
//auth and post controllers are separate because they handle different aspects of the application
const Notification = require("../models/Notification");
const { getIO } = require("../socket");
const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { content, privacy } = req.body;

    if (!content && !req.file) {
      return res.status(400).json({
        message: "Post must contain text or media",
      });
    }

    const post = await Post.create({
      author: req.userId,
      content: content || "",
      media: req.file ? `/uploads/${req.file.filename}` : "",
      mediaType: req.file
        ? req.file.mimetype.startsWith("video")
          ? "video"
          : "image"
        : "",
      privacy: privacy || "public",
    });

    const populatedPost = await post.populate(
      "author",
      "name email profilePicture"
    );


    console.log("EMITTING NEW POST:", populatedPost._id);
    getIO().emit("newPost", populatedPost);

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email profilePicture")
      .sort({ createdAt: -1 });

    const visiblePosts = posts.filter((post) => {
      if (post.privacy === "public") {
        return true;
      }

      if (post.privacy === "private") {
        return post.author._id.toString() === req.userId.toString();
      }

      if (post.privacy === "friends") {
        return (
          post.author._id.toString() === req.userId.toString() ||
          post.author.friends?.some(
            (friendId) => friendId.toString() === req.userId.toString()
          )
        );
      }

      return false;
    });

    res.json(visiblePosts);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.userId;

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();
    
    if (!alreadyLiked && post.author.toString() !== userId.toString()) {
  const notification = await Notification.create({
    recipient: post.author,
    sender: userId,
    type: "like",
    message: "Someone liked your post",
  });

  const populatedNotification = await notification.populate(
    "sender",
    "name email profilePicture"
  );

  getIO().emit("newNotification", populatedNotification);
}

    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  likePost,
};