import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore'; 

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;     
    if (token) {
      config.headers['auth'] = `Bearer ${token}`; 
    }    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const { status } = error.response || {};
        const isAuthRoute = error.config.url.endsWith('/login'); 
        if (status === 401 && !isAuthRoute) {
            console.warn("Token expirado o no válido. Cerrando sesión automáticamente.");
            useAuthStore.getState().logoutUser();
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default apiClient;