const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User')
const {ROLES} = require('../models/User')
const Team = require('../models/Team')
const {requireAuth, requireRole} = require('../middleware/auth')

const router = express.Router()

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const serializeUser = (user) => user.toSafeJSON()

// GET /api/users : full user directory with search and filters
// Query params: search (name/email), role (Admin|Supervisor|User), team (id | 'none')
router.get('/', requireAuth, requireRole('Admin'), async (req, res) => {
    try {
        const {search, role, team} = req.query
        const filter = {}

        if (search && String(search).trim()) {
            const pattern = new RegExp(escapeRegex(String(search).trim()), 'i')
            filter.$or = [{fullName: pattern}, {email: pattern}]
        }

        if (role) {
            if (!ROLES.includes(role)) {
                return res.status(400).json({message: 'Invalid role filter'})
            }
            filter.role = role
        }

        if (team) {
            if (team === 'none') {
                filter.team = null
            } else if (mongoose.Types.ObjectId.isValid(team)) {
                filter.team = team
            } else {
                return res.status(400).json({message: 'Invalid team filter'})
            }
        }

        const users = await User.find(filter)
            .populate('team', 'name')
            .sort({fullName: 1})

        return res.json({users: users.map(serializeUser)})
    } catch (err) {
        console.error('List users error:', err)
        return res.status(500).json({message: 'Unable to load users'})
    }
})

// PATCH /api/users/:id/role : assign a role to a user
router.patch('/:id/role', requireAuth, requireRole('Admin'), async (req, res) => {
    try {
        const {role} = req.body || {}
        if (!ROLES.includes(role)) {
            return res.status(400).json({message: 'Role must be one of: ' + ROLES.join(', ')})
        }

        if (String(req.params.id) === String(req.user._id)) {
            return res
                .status(400)
                .json({message: 'You cannot change your own role'})
        }

        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({message: 'User not found'})

        user.role = role
        await user.save()

        if (role !== 'Supervisor') {
            await Team.updateMany({supervisor: user._id}, {supervisor: null})
        }

        await user.populate('team', 'name')
        return res.json({user: serializeUser(user)})
    } catch (err) {
        console.error('Update role error:', err)
        return res.status(500).json({message: 'Unable to update role'})
    }
})

// PATCH /api/users/:id/team : assign or transfer a user's team
// Body: { teamId: '<id>' | null }
router.patch('/:id/team', requireAuth, requireRole('Admin'), async (req, res) => {
    try {
        const {teamId} = req.body || {}

        let team = null
        if (teamId) {
            if (!mongoose.Types.ObjectId.isValid(teamId)) {
                return res.status(400).json({message: 'Invalid team'})
            }
            team = await Team.findById(teamId)
            if (!team) return res.status(404).json({message: 'Team not found'})
        }

        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({message: 'User not found'})

        const previousTeam = user.team ? String(user.team) : null
        const nextTeam = team ? String(team._id) : null

        user.team = team ? team._id : null
        await user.save()

        // A supervisor leaving their team stops supervising it
        if (previousTeam && previousTeam !== nextTeam) {
            await Team.updateMany(
                {_id: previousTeam, supervisor: user._id},
                {supervisor: null}
            )
        }

        await user.populate('team', 'name')
        return res.json({user: serializeUser(user)})
    } catch (err) {
        console.error('Update team error:', err)
        return res.status(500).json({message: 'Unable to update team'})
    }
})

module.exports = router
