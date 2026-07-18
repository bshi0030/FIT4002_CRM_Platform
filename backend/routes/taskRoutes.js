const express = require("express");

const Notification = require("../models/Notification");

const router = express.Router();

const Task = require("../models/Task");

const mongoose = require("mongoose");

require("../models/Stage");
const { requireAuth } = require("../middleware/auth");

// every logged in users tasks
router.get("/", requireAuth, async (req, res) => {

  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const tasks = await Task.find({
    $or: [
        { assignedTo: userId },
        { createdBy: userId }
    ]
})

      .populate("assignedTo", "fullName")
      .populate("createdBy", "fullName")
      .populate("customer", "fullName company interactions")
      .populate("deal", "name")
      .populate("currentStage", "name")
      .populate("nextStage", "name")
      

      .sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to fetch tasks"
    });

  }

}); 

router.post("/", requireAuth, async (req, res) => {
  try {

    console.log("BODY:", req.body);

const task = new Task({
    title: req.body.title,
    description: req.body.description,
    company: req.body.company,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    status: "todo",

    createdBy: req.user._id,

    assignedTo:
        req.body.assignedTo?.length > 0
            ? req.body.assignedTo
            : [req.user._id]
});

    await task.save();

console.log("Task saved!");

const populatedTask = await Task.findById(task._id)
  .populate("assignedTo", "fullName");

console.log("Task populated!");

res.status(201).json(populatedTask);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to create task"
    });

  }
});

router.patch("/:id/status", requireAuth, async (req, res) => {

  try {

    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedTask);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to update task status"
    });

  }

});

module.exports = router;