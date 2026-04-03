import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
