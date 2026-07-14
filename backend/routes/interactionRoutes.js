const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { getInteractions, createInteraction, deleteInteraction, editInteraction } = require('../controllers/interactionController');

router.get('/:customerId', getInteractions);
router.post('/create', createInteraction);
router.delete('/:interactionId', requireAuth, requireRole('Admin'), deleteInteraction)
router.put('/:interactionId', editInteraction)

module.exports = router;
