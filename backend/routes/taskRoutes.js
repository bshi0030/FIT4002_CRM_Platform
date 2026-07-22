const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();
const Task = require("../models/Task");
const Customer = require("../models/Customer");
const mongoose = require("mongoose");
const { requireAuth } = require("../middleware/auth");

// every logged in users tasks
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const tasks = await Task.find({
      $or: [{ assignedTo: userId }, { createdBy: userId }]
    })

      .populate("assignedTo", "_id fullName")
      .populate("createdBy", "fullName")
      .populate("customer", "fullName company interactions")
      .populate("deal", "name stage company")

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

      customer: req.body.customer,
      deal: req.body.deal,

      priority: req.body.priority,
      dueDate: req.body.dueDate,
      status: "todo",

      createdBy: req.user._id,

      assignedTo:
        req.body.assignedTo?.length > 0 ? req.body.assignedTo : [req.user._id]
    });

    await task.save();

    console.log("Task saved!");

    if (req.body.customer) {
      await Customer.findByIdAndUpdate(req.body.customer, {
        $push: {
          interactions: {
            type: "Task",
            summary: req.body.title ? `${req.body.title}: ${req.body.description || ""}` : (req.body.description || ""),
            details: req.body.description || "",
            taskId: task._id,
            createdBy: req.user._id,
            author: req.user.fullName || (task.createdBy && task.createdBy.fullName),
            date: new Date()
          }
        }
      });
      console.log("Interaction logged to customer!");
    }

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "fullName")
      .populate("createdBy", "fullName")
      .populate("customer", "fullName company interactions");

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

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // Only the creator can edit
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only edit tasks you created."
      });
    }

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.customer = req.body.customer ?? task.customer;
    task.priority = req.body.priority ?? task.priority;
    task.dueDate = req.body.dueDate ?? task.dueDate;
    task.assignedTo = req.body.assignedTo ?? task.assignedTo;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("assignedTo", "fullName")
      .populate("createdBy", "fullName")
      .populate("customer", "fullName company interactions");

    res.json(updatedTask);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to update task"
    });
  }
});

module.exports = router;
