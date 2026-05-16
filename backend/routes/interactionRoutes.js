const express = require('express');
const router = express.Router();
const { getInteractions, createInteraction } = require('../controllers/interactionController');

router.get('/:customerId', getInteractions);
router.post('/create', createInteraction);

module.exports = router;