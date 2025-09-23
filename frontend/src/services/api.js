import axios from 'axios'

const api = axios.create({
	baseURL: '/api'
})

export const SensorAPI = {
	getPage: (page=1, size=10) => api.get(`/sensor/data?page=${page}&size=${size}`).then(r => r.data),
	getInfo: (size=10) => api.get(`/sensor/getinfo?size=${size}`).then(r => r.data),
	getAll: () => api.get('/sensor/all').then(r => r.data),
	getSearch: (type, search, page=1, size=10) => api.get(`/sensor/search?type=${type}&search=${search}&page=${page}&size=${size}`).then(r=>r.data),
}

export const ActionAPI = {
	getActionInfo: (size=10) => api.get(`/action/getinfo?size=${size}`).then(r => r.data),
	getActionPage: (page=1, size=10) => api.get(`/action/data?page=${page}&size=${size}`).then(r => r.data),
	getAll: () => api.get('/action/all').then(r => r.data),
	getActionSearch: (type, search, page=1, size=10) => api.get(`/action/search?type=${type}&search=${search}&page=${page}&size=${size}`).then(r=>r.data),
} 