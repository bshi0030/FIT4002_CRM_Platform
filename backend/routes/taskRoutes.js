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

router.patch('/:id/status', requireAuth, async (req, res) => {

  try {

    const { status } = req.body

    const updatedTask = await Task.findByIdAndUpdate(

      req.params.id,

      { status },

      { new: true }

    )

    res.json(updatedTask)

  } catch {

    res.status(500).json({
      message: 'Failed to update task status'
    })

  }

})

module.exports = router