const mongoose = require('mongoose')

const dealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  price: { type: String, required: true },
  stage: {
    type: String,
    enum: ['Qualified', 'Contact Made', 'Demo Scheduled', 'Proposal Made', 'Negotiation', 'Won', 'Lost'],
    default: 'Qualified'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  probability: { type: Number, default: 20 },
  daysAgo: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

module.exports = mongoose.model('Deal', dealSchema)