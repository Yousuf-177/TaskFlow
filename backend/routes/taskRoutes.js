const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {getAllTasks,getTaskByID,getDashboardData , getUserDashboardData , createTask, updateTask, deleteTask,updateTaskCheckList , updateTaskStatus
 } = require("../controllers/taskController.js")
const router = express.Router();

// Task Management Routes

router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.post("/", protect, adminOnly, createTask); // Create Task (admin only)
router.delete("/:id", protect, adminOnly, deleteTask); // Delete Task (delete only)
router.put("/:id", protect, updateTask);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskCheckList);
router.get("/",protect,getAllTasks) // Get all Tasks (admin : All tasks User : Assigned TAsks)
router.get("/:id",protect,getTaskByID) // Get Tasks By ID

module.exports = router;
