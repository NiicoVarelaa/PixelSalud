import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth-storage');
    
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        const token = parsedData?.state?.token;
        
        if (token) {
          console.log('🔐 Token encontrado, agregando a headers');
          config.headers['auth'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;