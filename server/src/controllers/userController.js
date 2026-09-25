const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .populate("friends", "name email profilePicture bio");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};