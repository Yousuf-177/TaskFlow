const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getUsers,
  getUserById,
  deleteUser,
} = require("../controllers/userController.js");
const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users (admin)
router.get("/:id", protect, getUserById); // Get user by ID
router.delete("/:id", protect, adminOnly, deleteUser); // Delete user (admin)

module.exports = router;
