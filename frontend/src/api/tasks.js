import api from './client'

export const getTasks = () =>
    api.get('/tasks').then(res => res.data)

export const updateTaskStatus = (taskId, status) =>
    api.patch(`/tasks/${taskId}/status`, {status})
        .then(res => res.data)
