const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  company: {
    type: String,
    default: ''
  },

  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },

  status: {
    type: String,
    enum: ['todo', 'inprogress', 'completed'],
    default: 'todo'
  },

  dueDate: {
    type: Date
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  collaborative: {
    type: Boolean,
    default: false
  }

}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)