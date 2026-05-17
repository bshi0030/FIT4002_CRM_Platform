const express = require('express')
const router = express.Router()
const Deal = require('../models/Deal')
const { requireAuth, requireRole } = require('../middleware/auth')

// GET all deals
router.get('/', requireAuth, async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 })
    res.json(deals)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch deals' })
  }
})

// POST create new deal — only User/salesperson role
router.post('/', requireAuth, requireRole('User', 'Admin'), async (req, res) => {
  try {
    const { name, company, price, priority, probability } = req.body

    const deal = new Deal({
      name,
      company,
      price,
      priority,
      probability,
      stage: 'Qualified',
      createdBy: req.user._id
    })

    await deal.save()
    res.status(201).json(deal)
  } catch (error) {
    res.status(500).json({ message: 'Failed to create deal' })
  }
})

module.exports = router