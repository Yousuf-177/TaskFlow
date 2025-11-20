const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {getUsers , getUserById ,deleteUser} = require("../controllers/userController.js")
const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // For Admin only Obtain all users details
router.get("/:id", protect, getUserById); // (User Id )Get a Specific User

module.exports = router;
