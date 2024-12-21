import axios from 'axios';

// Configurare de bază pentru Axios
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor pentru request-uri
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Interceptor pentru răspunsuri
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Definirea API-urilor specifice

// Auth API
const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    register: (data) => api.post('/auth/register', data),
};

// Drivers API
const driversAPI = {
    getAll: () => api.get('/drivers'),
    getById: (id) => api.get(`/drivers/${id}`),
    create: (data) => api.post('/drivers', data),
    update: (id, data) => api.put(`/drivers/${id}`, data),
    delete: (id) => api.delete(`/drivers/${id}`),
};

// Dashboard API
const dashboardAPI = {
    getOverview: () => api.get('/dashboard/overview'),
    getStats: () => api.get('/dashboard/stats'),
};

// Salaries API
const salariesAPI = {
    getAll: () => api.get('/salaries'),
    getById: (id) => api.get(`/salaries/${id}`),
    calculate: (data) => api.post('/salaries/calculate', data),
};

// Holidays API
const holidaysAPI = {
    getAll: () => api.get('/holidays'),
    requestHoliday: (data) => api.post('/holidays/request', data),
    approveHoliday: (id) => api.put(`/holidays/approve/${id}`),
};

// Fines API
const finesAPI = {
    getAll: () => api.get('/fines'),
    getById: (id) => api.get(`/fines/${id}`),
    payFine: (id) => api.post(`/fines/${id}/pay`),
};

// Exportul API-urilor
export {
    api as default,
    authAPI,
    driversAPI,
    dashboardAPI,
    salariesAPI,
    holidaysAPI,
    finesAPI,
};
