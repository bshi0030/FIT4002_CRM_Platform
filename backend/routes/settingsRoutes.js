const express = require('express')
const SystemSettings = require('../models/SystemSettings')
const {requireAuth, requireRole} = require('../middleware/auth')

const router = express.Router()

const serializeSettings = (settings) => ({
    companyName: settings.companyName,
    timezone: settings.timezone,
    currency: settings.currency,
    language: settings.language,
    updatedAt: settings.updatedAt,
})

// GET /api/settings : read global settings
router.get('/', requireAuth, async (req, res) => {
    try {
        const settings = await SystemSettings.getSingleton()
        return res.json({settings: serializeSettings(settings)})
    } catch (err) {
        console.error('Get settings error:', err)
        return res.status(500).json({message: 'Unable to load settings'})
    }
})

// PUT /api/settings : update global settings
router.put('/', requireAuth, requireRole('Admin'), async (req, res) => {
    try {
        const {companyName, timezone, currency, language} = req.body || {}
        const updates = {}

        const fields = {companyName, timezone, currency, language}
        const limits = {companyName: 120, timezone: 64, currency: 8, language: 40}

        for (const [key, value] of Object.entries(fields)) {
            if (value === undefined) continue
            const trimmed = String(value).trim()
            if (!trimmed) {
                return res.status(400).json({message: `${key} cannot be empty`})
            }
            if (trimmed.length > limits[key]) {
                return res
                    .status(400)
                    .json({message: `${key} cannot be more than ${limits[key]} characters`})
            }
            updates[key] = trimmed
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({message: 'No settings provided'})
        }

        const settings = await SystemSettings.findOneAndUpdate({}, updates, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            runValidators: true,
        })

        return res.json({settings: serializeSettings(settings)})
    } catch (err) {
        console.error('Update settings error:', err)
        return res.status(500).json({message: 'Unable to update settings'})
    }
})

module.exports = router
