import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response) {
            switch (response.status) {
                case 401:
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    toast.error('Session expired. Please login again.');
                    break;

                case 403:
                    toast.error('You do not have permission to perform this action.');
                    break;

                case 404:
                    toast.error('Resource not found.');
                    break;

                case 500:
                    toast.error('Server error. Please try again later.');
                    break;

                default:
                    const message = response.data?.error || 'An error occurred';
                    toast.error(message);
            }
        } else {
            toast.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;