const express = require("express");

const {
  createComment,
  getComments,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:postId", protect, createComment);

router.get("/:postId", protect, getComments);

module.exports = router;