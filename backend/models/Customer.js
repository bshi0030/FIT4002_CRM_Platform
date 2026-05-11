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
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
