import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({baseURL})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('nexgen_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('nexgen_token')
        }
        return Promise.reject(err)
    }
)

export default api
