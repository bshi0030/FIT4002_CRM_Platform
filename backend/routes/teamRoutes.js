const express = require('express')
const mongoose = require('mongoose')
const Team = require('../models/Team')
const User = require('../models/User')
const Customer = require('../models/Customer')
const {requireAuth, requireRole} = require('../middleware/auth')

const router = express.Router()

const serializeTeam = (team, memberCount = 0) => ({
    id: team._id,
    name: team.name,
    sharingEnabled: team.sharingEnabled,
    supervisor: team.supervisor
        ? {
              id: team.supervisor._id,
              fullName: team.supervisor.fullName,
              email: team.supervisor.email,
          }
        : null,
    memberCount,
    createdAt: team.createdAt,
})

const countMembers = async (teamIds) => {
    const counts = await User.aggregate([
        {$match: {team: {$in: teamIds}}},
        {$group: {_id: '$team', count: {$sum: 1}}},
    ])
    return new Map(counts.map((c) => [String(c._id), c.count]))
}

// GET /api/teams : list all teams (Admin only; used by team management and filters)
router.get('/', requireAuth, requireRole('Admin'), async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('supervisor', 'fullName email')
            .sort({name: 1})
        const counts = await countMembers(teams.map((t) => t._id))
        return res.json({
            teams: teams.map((t) => serializeTeam(t, counts.get(String(t._id)) || 0)),
        })
    } catch (err) {
        console.error('List teams error:', err)
        return res.status(500).json({message: 'Unable to load teams'})
    }
})

// GET /api/teams/my-team : the requesting user's team, members and sharing status
router.get('/my-team', requireAuth, async (req, res) => {
    try {
        if (!req.user.team) return res.json({team: null, members: []})

        const team = await Team.findById(req.user.team).populate(
            'supervisor',
            'fullName email'
        )
        if (!team) return res.json({team: null, members: []})

        const members = await User.find({team: team._id})
            .select('fullName email role createdAt')
            .sort({fullName: 1})

        const ownedCustomers = await Customer.countDocuments({team: team._id})

        return res.json({
            team: serializeTeam(team, members.length),
            members: members.map((m) => ({
                id: m._id,
                fullName: m.fullName,
                email: m.email,
                role: m.role,
            })),
            customerCount: ownedCustomers,
        })
    } catch (err) {
        console.error('My team error:', err)
        return res.status(500).json({message: 'Unable to load your team'})
    }
})

// POST /api/teams : create a team
router.post('/', requireAuth, requireRole('Admin'), async (req, res) => {
    try {
        const name = (req.body?.name || '').trim()
        if (!name) return res.status(400).json({message: 'Team name is required'})
        if (name.length > 80) {
            return res.status(400).json({message: 'Team name cannot be more than 80 characters'})
        }

        const existing = await Team.findOne({
            name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        })
        if (existing) {
            return res.status(409).json({message: 'A team with this name already exists'})
        }

        const team = await Team.create({name})
        return res.status(201).json({team: serializeTeam(team, 0)})
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({message: 'A team with this name already exists'})
        }
        console.error('Create team error:', err)
        return res.status(500).json({message: 'Unable to create team'})
    }
})

// PATCH /api/teams/:id : rename, toggle sharing, designate supervisor
// Body: { name?, sharingEnabled?, supervisorId? (id | null) }
router.patch('/:id', requireAuth, requireRole('Admin'), async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
        if (!team) return res.status(404).json({message: 'Team not found'})

        const {name, sharingEnabled, supervisorId} = req.body || {}

        if (name !== undefined) {
            const trimmed = String(name).trim()
            if (!trimmed) return res.status(400).json({message: 'Team name is required'})
            if (trimmed.length > 80) {
                return res.status(400).json({message: 'Team name cannot be more than 80 characters'})
            }
            const clash = await Team.findOne({
                _id: {$ne: team._id},
                name: new RegExp(`^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
            })
            if (clash) {
                return res.status(409).json({message: 'A team with this name already exists'})
            }
            team.name = trimmed
        }

        if (sharingEnabled !== undefined) {
            team.sharingEnabled = Boolean(sharingEnabled)
        }

        if (supervisorId !== undefined) {
            if (supervisorId === null || supervisorId === '') {
                team.supervisor = null
            } else {
                if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
                    return res.status(400).json({message: 'Invalid supervisor'})
                }
                const supervisor = await User.findById(supervisorId)
                if (!supervisor) {
                    return res.status(404).json({message: 'Supervisor user not found'})
                }
                if (supervisor.role === 'Admin') {
                    return res
                        .status(400)
                        .json({message: 'Admins cannot be designated as team supervisors'})
                }

                await Team.updateMany(
                    {_id: {$ne: team._id}, supervisor: supervisor._id},
                    {supervisor: null}
                )
                supervisor.team = team._id
                if (supervisor.role !== 'Supervisor') supervisor.role = 'Supervisor'
                await supervisor.save()

                team.supervisor = supervisor._id
            }
        }

        await team.save()
        await team.populate('supervisor', 'fullName email')
        const memberCount = await User.countDocuments({team: team._id})
        return res.json({team: serializeTeam(team, memberCount)})
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({message: 'A team with this name already exists'})
        }
        console.error('Update team error:', err)
        return res.status(500).json({message: 'Unable to update team'})
    }
})

// DELETE /api/teams/:id : delete a team
router.delete('/:id', requireAuth, requireRole('Admin'), async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
        if (!team) return res.status(404).json({message: 'Team not found'})

        await User.updateMany({team: team._id}, {team: null})

        await Customer.updateMany({team: team._id}, {team: null})
        await Team.findByIdAndDelete(team._id)

        return res.json({message: 'Team deleted', teamName: team.name})
    } catch (err) {
        console.error('Delete team error:', err)
        return res.status(500).json({message: 'Unable to delete team'})
    }
})

module.exports = router
