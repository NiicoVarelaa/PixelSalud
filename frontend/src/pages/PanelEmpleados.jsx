import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom"; // Importamos Outlet y useLocation
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import NavbarEmpleado from "../components/NavbarEmpleado";
import SidebarEmpleado from "../components/SidebarEmpleado"; // Importamos el nuevo Sidebar

const PanelEmpleados = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Protección de ruta
  useEffect(() => {
    if (!user || user.rol !== 'empleado') {
        toast.error("Acceso no autorizado.");
        navigate('/login');
        return;
    }
  }, [user, navigate]);

  if (!user) {
      return <div className="flex justify-center items-center h-screen"><p>Cargando...</p></div>;
  }

  // Lógica para mostrar/ocultar Sidebar
  // Si la ruta es EXACTAMENTE "/panelempleados", estamos en el dashboard de cards -> NO mostrar sidebar
  // Si la ruta es "/panelempleados/venta", etc. -> SÍ mostrar sidebar
  const esDashboardInicial = location.pathname === '/panelempleados';

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. Navbar Superior (Siempre visible) */}
      <NavbarEmpleado />

      {/* 2. Contenedor Flexible */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* A) SIDEBAR: Se oculta si estamos en el inicio */}
        {!esDashboardInicial && (
            <SidebarEmpleado user={user} />
        )}

        {/* B) ÁREA PRINCIPAL */}
        <main className="flex-1 overflow-y-auto relative bg-gray-100">
            {/* <Outlet /> es un hueco donde React Router va a pintar 
                el componente hijo que corresponda según la URL 
                (Venta, Productos, Cards, etc.)
            */}
            <Outlet />
        </main>

      </div>
    </div>
  );
};

export default PanelEmpleados;