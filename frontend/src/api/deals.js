import api from './client'

export const getDeals = () =>
    api.get('/deals').then(r => r.data)

export const createDeal = (payload) =>
    api.post('/deals', payload).then(r => r.data)