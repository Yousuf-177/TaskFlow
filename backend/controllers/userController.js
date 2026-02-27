const User = require("../models/User.js");
const Task = require("../models/Task.js");
const bcrypt = require("bcryptjs");

// @desc    Get All Users (Admin Only)
// @route   api/auth/
// @access  PRIVATE (admin Only)

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    // Count Tasks of each USers and divide it on basis of completedd or not

    const usersWithTasksCount = await Promise.all(
      users.map(async (user) => {
        const PendingTask = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const InProgressTask = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const CompletedTask = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc, //include all existing user data
          PendingTask,
          InProgressTask,
          CompletedTask,
        };
      }),
    );

    return res.json(usersWithTasksCount);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed TO get All Users", error: error.message });
  }
};

// @desc    Get User By ID
// @route   api/auth/:id
// @access  PRIVATE (For Specific User ID Only)

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(403).json({ message: "User not Found " });
    res.json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed TO get User By ID", error: error.message });
  }
};

// @desc    Delete User (Admin Only)
// @route   DELETE api/users/:id
// @access  PRIVATE (admin Only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove this user from any tasks they were assigned to
    await Task.updateMany(
      { assignedTo: user._id },
      { $pull: { assignedTo: user._id } },
    );

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

module.exports = { getUsers, getUserById, deleteUser };
