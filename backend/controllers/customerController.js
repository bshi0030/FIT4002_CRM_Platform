const Customer = require('../models/Customer');
const path = require('path');
const fs = require('fs');

// @desc    Create new customer
// @route   POST /api/customers
// @access  Public (for now)
const createCustomer = async (req, res) => {
  try {
    const { fullName, phone, email, company, address, designation, department } = req.body;
    
    let companyLogo = '';
    if (req.file) {
      companyLogo = `/uploads/${req.file.filename}`;
    }

    if (!fullName || !phone || !email || !company || !address || !designation || !department) {
      return res.status(400).json({ message: 'Please include all required fields' });
    }

    const customer = await Customer.create({
      fullName, phone, email, company, address, designation, department, companyLogo
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all customers
// @route   GET /api/customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
const updateCustomer = async (req, res) => {
  try {
    const { fullName, phone, email, company, address, designation, department } = req.body;
    let customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const updatedData = { fullName, phone, email, company, address, designation, department };
    if (req.file) updatedData.companyLogo = `/uploads/${req.file.filename}`;

    customer = await Customer.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- FILE ATTACHMENT CONTROLLERS ---

const uploadCustomerFile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

    const newFile = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: `/uploads/documents/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size
    };

    customer.attachments.push(newFile);
    await customer.save();

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getFileFromCustomer = async (customerId, fileId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new Error('Customer not found');
  const file = customer.attachments.id(fileId);
  if (!file) throw new Error('File not found');
  return file;
};

const viewCustomerFile = async (req, res) => {
  try {
    const file = await getFileFromCustomer(req.params.id, req.params.fileId);
    const filePath = path.join(__dirname, '../', file.path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on server' });
    
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', 'inline; filename="' + file.originalName + '"');
    res.sendFile(filePath);
  } catch (error) {
    res.status(error.message.includes('not found') ? 404 : 500).json({ message: error.message || 'Server Error' });
  }
};

const downloadCustomerFile = async (req, res) => {
  try {
    const file = await getFileFromCustomer(req.params.id, req.params.fileId);
    const filePath = path.join(__dirname, '../', file.path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on server' });
    
    res.download(filePath, file.originalName);
  } catch (error) {
    res.status(error.message.includes('not found') ? 404 : 500).json({ message: error.message || 'Server Error' });
  }
};

const deleteCustomerFile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const fileIndex = customer.attachments.findIndex(f => f._id.toString() === req.params.fileId);
    if (fileIndex === -1) return res.status(404).json({ message: 'File not found' });

    const file = customer.attachments[fileIndex];
    const filePath = path.join(__dirname, '../', file.path);

    customer.attachments.splice(fileIndex, 1);
    await customer.save();

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  uploadCustomerFile,
  viewCustomerFile,
  downloadCustomerFile,
  deleteCustomerFile
};
