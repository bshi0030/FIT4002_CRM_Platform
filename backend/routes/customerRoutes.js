const express = require('express');
const router = express.Router();
const { uploadLogo, uploadDocument } = require('../middleware/uploadMiddleware');
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  uploadCustomerFile,
  viewCustomerFile,
  downloadCustomerFile,
  deleteCustomerFile
} = require('../controllers/customerController');

router.route('/')
  .post(uploadLogo.single('companyLogo'), createCustomer)
  .get(getCustomers);

router.route('/:id')
  .get(getCustomerById)
  .put(uploadLogo.single('companyLogo'), updateCustomer);

// File attachment endpoints
router.post('/:id/files', uploadDocument.single('file'), uploadCustomerFile);
router.get('/:id/files/:fileId/view', viewCustomerFile);
router.get('/:id/files/:fileId/download', downloadCustomerFile);
router.delete('/:id/files/:fileId', deleteCustomerFile);

module.exports = router;
