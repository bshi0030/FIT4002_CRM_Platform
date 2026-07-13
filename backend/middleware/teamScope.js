const User = require('../models/User')
const Team = require('../models/Team')

const isLegacyCustomer = (customer) => !customer.owner && !customer.team

const teamSharingEnabled = async (teamId) => {
    if (!teamId) return false
    const team = await Team.findById(teamId).select('sharingEnabled')
    return Boolean(team && team.sharingEnabled)
}

// Filter matching every customer the user is allowed to see
const getVisibleCustomerFilter = async (user) => {
    if (user.role === 'Admin') return {}

    const clauses = [
        {owner: user._id},
        {owner: null, team: null},
    ]

    if (user.team) {
        if (user.role === 'Supervisor') {
            clauses.push({team: user.team})
        } else if (await teamSharingEnabled(user.team)) {
            clauses.push({team: user.team})
        }
    }

    return {$or: clauses}
}

const canViewCustomer = async (user, customer) => {
    if (user.role === 'Admin') return true
    if (customer.owner && String(customer.owner._id || customer.owner) === String(user._id)) {
        return true
    }
    if (isLegacyCustomer(customer)) return true
    if (
        user.team &&
        customer.team &&
        String(customer.team._id || customer.team) === String(user.team)
    ) {
        if (user.role === 'Supervisor') return true
        return teamSharingEnabled(user.team)
    }
    return false
}

// IDs of all users in the same team as user
const getTeamMemberIds = async (user) => {
    if (!user.team) return [user._id]
    const members = await User.find({team: user.team}).select('_id')
    const ids = members.map((m) => m._id)
    if (!ids.some((id) => String(id) === String(user._id))) ids.push(user._id)
    return ids
}

// Filter matching every deal the user is allowed to see.
const getVisibleDealFilter = async (user) => {
    if (user.role === 'Admin') return {}
    const memberIds = await getTeamMemberIds(user)
    return {createdBy: {$in: memberIds}}
}

const canAccessDeal = async (user, deal) => {
    if (user.role === 'Admin') return true
    if (!deal.createdBy) return false
    const memberIds = await getTeamMemberIds(user)
    return memberIds.some((id) => String(id) === String(deal.createdBy._id || deal.createdBy))
}

module.exports = {
    getVisibleCustomerFilter,
    canViewCustomer,
    getTeamMemberIds,
    getVisibleDealFilter,
    canAccessDeal,
}
