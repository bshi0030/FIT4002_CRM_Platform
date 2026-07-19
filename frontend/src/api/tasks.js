import api from './client'

export const getTasks = () =>
  api.get('/tasks').then(res => res.data)

export const updateTaskStatus = (taskId, status) =>
  api.patch(`/tasks/${taskId}/status`, { status })
     .then(res => res.data)

export const createTask = (taskData) =>
  api.post("/tasks", taskData)
     .then(res => res.data);

export const updateTask = (taskId, taskData) =>
  api.patch(`/tasks/${taskId}`, taskData)
     .then(res => res.data);

