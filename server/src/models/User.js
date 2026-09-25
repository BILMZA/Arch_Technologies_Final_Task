//this file will define the user model for the social network application
//in easy terms, a model is a blueprint for how data will be stored in the database
//user model will define the structure of a user, including their name, email, password, profile picture, and bio
//post = admin 
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },
    
    privacy: {
  type: String,
  enum: ["public", "friends", "private"],
  default: "public",
   },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);