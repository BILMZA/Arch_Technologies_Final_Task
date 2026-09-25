//this file will define the post model for the social network application
//in easy terms, a model is a blueprint for how data will be stored in the database
//user file is the model for the user, this file is the model for the post
//post model will define the structure of a post, including the author, content, media, likes, and privacy settings
//we cannot add both user and post models in the same file because they are separate entities with different structures and purposes

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    media: {
      type: String,
      default: "",
    },

    mediaType: {
      type: String,
      enum: ["image", "video", ""],
      default: "",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    privacy: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);