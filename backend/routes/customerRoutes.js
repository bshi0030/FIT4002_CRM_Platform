const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  createCustomer,
  getCustomers,
  getCustomerById
} = require('../controllers/customerController');

router.route('/')
  .post(upload.single('companyLogo'), createCustomer)
  .get(getCustomers);

router.route('/:id')
  .get(getCustomerById);

module.exports = router;
