const express = require('express')

const router = express.Router()

const Task = require('../models/Task')

const { requireAuth } = require('../middleware/auth')

// every logged in users tasks
router.get('/', requireAuth, async (req, res) => {

  try {

    const tasks = await Task.find({
      assignedTo: req.user._id
    }).sort({ createdAt: -1 })

    res.json(tasks)

  } catch {

    res.status(500).json({
      message: 'Failed to fetch tasks'
    })

  }

})

module.exports = router