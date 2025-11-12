import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore'; 

// --- Configuración Inicial ---

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor de Peticiones (Envío del Token) ---

apiClient.interceptors.request.use(
  (config) => {
    // 1. Obtener el token del store de Zustand
    const token = useAuthStore.getState().token; 
    
    // 2. Si existe un token, lo adjuntamos usando el esquema 'Bearer'
    if (token) {
      // Tu backend (auth.js) espera el token en la cabecera 'auth' 
      // y lo limpia con .replace("Bearer ", "").
      // Así que lo enviamos en el formato esperado:
      config.headers['auth'] = `Bearer ${token}`; 
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Interceptor de Respuestas (Manejo de 401) ---

apiClient.interceptors.response.use(
    (response) => response, // Petición exitosa, pasa la respuesta
    (error) => {
        const { status } = error.response || {};
        const isAuthRoute = error.config.url.endsWith('/login'); // Evitar bucle si falla el login

        // 1. Capturar el error 401 (Unauthorized), que tu backend envía 
        // cuando el token está ausente, expirado o no es válido.
        if (status === 401 && !isAuthRoute) {
            console.warn("Token expirado o no válido. Cerrando sesión automáticamente.");
            
            // 2. Limpiar el estado de autenticación (Zustand y localStorage)
            useAuthStore.getState().logoutUser();
            
            // Opcional: Redirigir al usuario (ej: si usas React Router DOM)
            // history.push('/login'); 
            
            // 3. Devolver un error rechazado para que la llamada original falle limpiamente
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);


export default apiClient;