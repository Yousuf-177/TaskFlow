const Task = require("../models/Task");
const User = require("../models/User");

// @desc - Get all tasks (that being assigned to user)
// @route - GET api/task/
// @access - PRIVATE assigned Users
const getAllTasks = async (req, res) => {
  try {
    let tasks = [];
    if (req.user.role == "admin") {
      tasks = await Task.find().populate(
        "assignedTo",
        "name email profileImage"
      );
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImage"
      );
    }

    res.status(201).json({ message: "Tasks Successfully Fetched", tasks });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error While Fetching All Tasks Details",
      error: error.message,
    });
  }
};

// @desc - Get task by id
// @route - GET api/task/:id
// @access - PRIVATE assigned Users
const getTaskByID = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImage"
    );

    if (!task) return res.status(403).json({ message: "No Task Found" });

    res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({
      message: "Server Error While getting task By ID",
      error: error.message,
    });
  }
};

// @desc - Dashboard-data 
// @route - GET api/task/dashboard-data
// @access - 
const getDashboardData = async (req, res) => {
  try {
    // Fetch Statistics
    const totalTasks = await Task.countDocuments();
    const PendingTasks = await Task.countDocuments({ status: "Pending" });
    const CompletedTasks = await Task.countDocuments({ status: "Completed" });
    const OverDueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // For Ensuring all possible statuses are included
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    // wants to count how many tasks exist for each known status (Pending, In Progress, Completed) and store the counts in an easy-to-use object.
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      // This removes all spaces from the status string, so it can be used as a clean object key.
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    // For Ensuring all possible priorities are included
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevel = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Find 10 Recent Task

    const recentTask = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title dueDate priority status createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        PendingTasks,
        CompletedTasks,
        OverDueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevel,
      },
      recentTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error while Fetching Dashboard Data",
      error: error.message,
    });
  }
};

// @desc - Dashboard-data (user-specific)
// @route - GET api/task/user-dashboard-data
// @access - Private logged in user
const getUserDashboardData = async (req, res) => {
  try {
    const userID = req.body; // only fetch data for login user

    // Fetch statistics for user dpecific tasks

    const totalTasks = await Task.countDocuments({ assignedTo: userID });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userID,
      status: "Pending",
    });
    const InProgressTasks = await Task.countDocuments({
      assignedTo: userID,
      status: "In Progress",
    });
    const CompletedTasks = await Task.countDocuments({
      assignedTo: userID,
      status: "Completed",
    });
    const OverDueTasks = await Task.countDocuments({
      assignedTo: userID,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // Ensuring all status are present in response
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $match: { assignedTo: userID },
      },
        {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelRaw = await Task.aggregate([
      {
        $match: {
          assignedTo: userID,
        },
      },
      {
        $group: {
          _id: "priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevel = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch recent 10 task

    const recentTask = await Task.find({ assignedTo: userID })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

      res.status(200).json({
        statistics : {
          totalTasks,
          pendingTasks,
          InProgressTasks,
          CompletedTasks,
          OverDueTasks
        },
        charts:{
          taskDistribution,
          taskPriorityLevel
        },
        recentTask
      })

    } catch (error) {
    return res.status(500).json({
      message: "Server Error while Fetching User Dashboard Data",
      error: error.message,
    });
  }
};
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    if (!title || !dueDate) {
      return res
        .status(403)
        .json({ message: "Please fill important info (due date and title) " });
    }

    if (!Array.isArray(assignedTo))
      return res.status(403).json({
        message: "Assigned To must be arrays of user IDS ",
      });

    const newTask = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todoChecklist,
    });

    res.status(201).json({ message: "Task Created Successfully", newTask });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error while creating task",
      error: error.message,
    });
  }
};
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(201).json({ message: "No Task Found" });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.priority = req.body.priority || task.priority;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo))
        return res
          .status(403)
          .json({ message: "Assigned To must be an Array Type of User IDs" });
      task.assignedTo = req.body.assignedTo;
    }
    const updatedTask = await task.save();

    res.status(201).json({ message: "Task Successfully Updated", updatedTask });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error while updating task",
      error: error.message,
    });
  }
};
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(403).json({ message: "No Task Found" });

    await Task.deleteOne(task._id);
    res.status(201).json({ message: "Task Deleted Successfully", task });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error while deleting task",
      error: error.message,
    });
  }
};
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "No Task Found" });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin")
      return res.status(403).json({ message: "Not Authorized" });

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((todo) => (todo.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.status(201).json({ message: "Task Status Successfully Updated", task });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error while updating Task Status",
      error: error.message,
    });
  }
};
const updateTaskCheckList = async (req, res) => {
  try {
    const { todoChecklist } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "No Task Found" });

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Not Authorized" });

    task.todoChecklist = todoChecklist;

    // For Updated Checklist Auto Update Progress based on Checklist Completion
    const completedCount = task.todoChecklist.filter(
      (todo) => todo.completed === true
    ).length;
    const totalCount = task.todoChecklist.length;
    task.progress =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Auto mark Task As completed if all items are checked
    if (task.progress == 100) task.status = "Completed";
    else if (task.progress > 0) task.status = "In Progress";
    else task.status = "Pending";

    await task.save();

    res
      .status(200)
      .json({ message: "To-Do Check List Updated Successfully", task });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error while updating Task Check List",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskByID,
  getDashboardData,
  getUserDashboardData,
  createTask,
  updateTask,
  deleteTask,
  updateTaskCheckList,
  updateTaskStatus,
};
