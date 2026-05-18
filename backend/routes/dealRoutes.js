const express = require('express')
const router = express.Router()
const Deal = require('../models/Deal')
const Stage = require('../models/Stage')
const { requireAuth, requireRole } = require('../middleware/auth')

const STAGE_ORDER = [
  'Qualified',
  'Contact Made',
  'Demo Scheduled',
  'Proposal Made',
  'Negotiation',
  'Won',
  'Lost'
]

// GET all deals
router.get('/', requireAuth, async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 })
    res.json(deals)
  } catch {
    res.status(500).json({ message: 'Failed to fetch deals' })
  }
})

// CREATE deal
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
  } catch {
    res.status(500).json({ message: 'Failed to create deal' })
  }
})

// ✅ UPDATE deal stage (drag & drop)
router.patch('/:id/stage', requireAuth, async (req, res) => {
  try {
    const { stage } = req.body
    const deal = await Deal.findById(req.params.id)

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' })
    }

    const currentIndex = STAGE_ORDER.indexOf(deal.stage)
    const nextIndex = STAGE_ORDER.indexOf(stage)

    // Prevent invalid transitions
    if (currentIndex === -1 || nextIndex === -1) {
      return res.status(400).json({ message: 'Invalid stage' })
    }

    // Prevent moving backwards OR from Won/Lost
    if (nextIndex < currentIndex || ['Won', 'Lost'].includes(deal.stage)) {
      return res.status(400).json({ message: 'Stage transition not allowed' })
    }

    deal.stage = stage
    await deal.save()

    res.json(deal)
  } catch {
    res.status(500).json({ message: 'Failed to update deal stage' })
  }
})

module.exports = router