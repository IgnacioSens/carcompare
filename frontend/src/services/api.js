import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getCars    = ()   => api.get('/cars').then(r => r.data)
export const getCarById = (id) => api.get(`/cars/${id}`).then(r => r.data)
