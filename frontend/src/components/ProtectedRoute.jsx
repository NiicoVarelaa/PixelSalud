import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; // ¡Importamos TU store!

/*
Este componente es súper flexible. Le podés pasar:
- allowedRoles: Un array de roles que SÍ pueden entrar (ej: ['admin', 'empleado'])
- requiredPermission: Un permiso específico que DEBE tener (ej: 'gestionar_productos')
*/
const ProtectedRoute = ({ allowedRoles }) => {
    // Leemos el 'user' directamente de tu store de Zustand
    const { user } = useAuthStore(); 
    const location = useLocation();

    // 1. Chequeo de Login: ¿Hay un usuario en el store?
    if (!user) {
        // Si no hay usuario, lo mandamos al login.
        // Guardamos la 'location' para que, después de loguearse,
        // React Router lo devuelva a la página que quería ver.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Chequeo de Rol: ¿El rol del usuario está permitido?
    // Si la ruta tiene 'allowedRoles' y el rol del user NO está en ese array...
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        // ¡No tiene el rol! Lo mandamos a una página de "No Autorizado".
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;