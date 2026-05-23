import api from './client'

export const getTasks = () =>
  api.get('/tasks').then(res => res.data)