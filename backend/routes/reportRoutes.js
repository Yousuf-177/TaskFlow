const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware.js");
const { exportTasksReports, exportUsersReports } = require("../controllers/reportController.js");
const router = express.Router();

router.get("export/tasks", protect, adminOnly, exportTasksReports); // export all tasks as excel / PDF
router.get("export/users", protect, adminOnly, exportUsersReports); // export user task report

module.exports = router;
