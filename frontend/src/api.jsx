import axios from "axios"
import Cookies from 'js-cookie'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})


api.interceptors.request.use(
    (config) => {
        const csrfToken = Cookies.get('csrftoken');
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    r => r,
    async err => {
        const original = err.config || {};
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                await api.post('/accounts/token/refresh/');
                return api(original);
            } catch (e) {
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        }
        throw err;
    }
);

export default api