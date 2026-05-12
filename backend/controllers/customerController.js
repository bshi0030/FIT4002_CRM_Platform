const Customer = require('../models/Customer');

// @desc    Create new customer
// @route   POST /api/customers
// @access  Public (for now)
const createCustomer = async (req, res) => {
  try {
    const { fullName, phone, email, company, address, designation, department } = req.body;
    
    let companyLogo = '';
    if (req.file) {
      // Store relative path so frontend can access via /uploads/...
      companyLogo = `/uploads/${req.file.filename}`;
    }

    // Basic validation
    if (!fullName || !phone || !email || !company || !address || !designation || !department) {
      return res.status(400).json({ message: 'Please include all required fields' });
    }

    const customer = await Customer.create({
      fullName,
      phone,
      email,
      company,
      address,
      designation,
      department,
      companyLogo
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all customers
// @route   GET /api/customers
// @access  Public (for now)
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Public (for now)
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Public (for now)
const updateCustomer = async (req, res) => {
  try {
    const { fullName, phone, email, company, address, designation, department } = req.body;
    
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Basic validation
    if (!fullName || !phone || !email || !company || !address || !designation || !department) {
      return res.status(400).json({ message: 'Please include all required fields' });
    }

    const updatedData = {
      fullName,
      phone,
      email,
      company,
      address,
      designation,
      department
    };

    if (req.file) {
      updatedData.companyLogo = `/uploads/${req.file.filename}`;
    }

    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer
};
