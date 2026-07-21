const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  address: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  companyLogo: { type: String }, // stores the file path
  attachments: [{
    originalName: String,
    filename: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  interactions: [{
    type: { type: String, enum: ['Email', 'Call', 'Task', 'Note'] },
    details: String,
    author: { type: String, default: "System" },
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
