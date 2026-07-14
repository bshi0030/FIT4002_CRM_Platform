import api from './client'

export const fetchUsers = (params = {}) =>
    api.get('/users', {params}).then((r) => r.data)

export const updateUserRole = (userId, role) =>
    api.patch(`/users/${userId}/role`, {role}).then((r) => r.data)

export const updateUserTeam = (userId, teamId) =>
    api.patch(`/users/${userId}/team`, {teamId}).then((r) => r.data)
