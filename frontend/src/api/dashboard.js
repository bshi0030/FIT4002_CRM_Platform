import client from './client'

export const fetchDashboardData = async () => {
    const { data } = await client.get('/dashboard')
    return data
}
