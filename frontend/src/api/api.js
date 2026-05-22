import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // adjust if port is different
});

export default api;