const express = require('express');
const router = express.Router();
const { uploadLogo, uploadDocument } = require('../middleware/uploadMiddleware');
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  uploadCustomerFile,
  viewCustomerFile,
  downloadCustomerFile,
  deleteCustomerFile,
  addInteraction,
  deleteInteraction,
  editInteraction
} = require('../controllers/customerController');

router.route('/')
  .post(requireAuth, uploadLogo.single('companyLogo'), createCustomer)
  .get(requireAuth, getCustomers);

router.route('/:id')
  .get(requireAuth, getCustomerById)
  .put(requireAuth, uploadLogo.single('companyLogo'), updateCustomer)
  .delete(requireAuth, requireRole('Admin'), deleteCustomer);

// File attachment endpoints
router.post('/:id/files', requireAuth, uploadDocument.single('file'), uploadCustomerFile);
router.get('/:id/files/:fileId/view', viewCustomerFile);
router.get('/:id/files/:fileId/download', downloadCustomerFile);
router.delete('/:id/files/:fileId', requireAuth, requireRole('Admin'), deleteCustomerFile);

// Interactions endpoint
router.post('/:id/interactions', requireAuth, addInteraction);
router.delete('/:id/interactions/:interactionId', requireAuth, requireRole('Admin'), deleteInteraction);
router.put('/:id/interactions/:interactionId', requireAuth, editInteraction);

module.exports = router;
