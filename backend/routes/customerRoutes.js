const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer
} = require('../controllers/customerController');

router.route('/')
  .post(upload.single('companyLogo'), createCustomer)
  .get(getCustomers);

router.route('/:id')
  .get(getCustomerById)
  .put(upload.single('companyLogo'), updateCustomer);

module.exports = router;
