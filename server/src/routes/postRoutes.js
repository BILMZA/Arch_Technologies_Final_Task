//this file will define the routes for the post endpoints of the social network application

//in easy terms, this file will define the routes for creating, retrieving, and liking posts

//auth and post routes are separate because they handle different aspects of the application

const express = require("express");

const {
  createPost,
  getPosts,
  likePost,
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", protect, getPosts);

router.post(
  "/",
  protect,
  upload.single("media"),
  createPost
);

router.post("/:id/like", protect, likePost);

module.exports = router;