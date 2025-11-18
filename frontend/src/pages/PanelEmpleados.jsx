import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import NavbarEmpleado from "../components/NavbarEmpleado";

// --- IMPORTAMOS TODAS LAS VISTAS ---
import VistaInicialCards from "../components/VistiaInicialCardsEmpleado";
import EmpleadoRealizarVenta from "../components/EmpleadoRealizarVenta";
import EmpleadoListaVentas from "../components/EmpleadoListaVentas";
import EmpleadoEditarVenta from "../components/EmpleadoEditarVenta";
import EmpleadoProductos from "../components/EmpleadosProductos"; // <-- 1. ¡IMPORTAMOS EL NUEVO!

const PanelEmpleados = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [vistaActual, setVistaActual] = useState('inicio');
  const [idVentaAEditar, setIdVentaAEditar] = useState(null);

  // Protección de ruta
  useEffect(() => {
    if (!user || user.rol !== 'empleado') {
        toast.error("Acceso no autorizado.");
        navigate('/login');
        return;
    }
  }, [user, navigate]);

  // Navegación
  const handleVolver = () => setVistaActual('inicio');
  
  const navegarA = (vista) => {
    setIdVentaAEditar(null);
    setVistaActual(vista);
  };

  const iniciarEdicion = (idVenta) => {
    setIdVentaAEditar(idVenta);
    setVistaActual('editarVenta');
  };

  if (!user) {
      return <div className="flex justify-center items-center h-screen"><p>Cargando...</p></div>;
  }

  // --- RENDERIZADOR DE VISTAS ---
  const renderizarVista = () => {
    switch (vistaActual) {
      case 'venta':
        return <EmpleadoRealizarVenta 
                  onVolver={handleVolver} 
                  onVentaExitosa={() => navegarA('misVentas')} 
               />;
      
      case 'misVentas':
        return <EmpleadoListaVentas 
                  onVolver={handleVolver}
                  endpoint={`/ventasEmpleados/${user.id}`}
                  title="Mis Ventas Personales"
                  onEditar={iniciarEdicion}
               />;
        
      case 'productos':
         // 2. ¡AQUÍ ESTÁ LA UNIFICACIÓN!
         // Reemplazamos el texto viejo por el componente nuevo.
         return <EmpleadoProductos onVolver={handleVolver} />;
      
      case 'ventasTotales':
         return <EmpleadoListaVentas 
                  onVolver={handleVolver}
                  endpoint="/ventasEmpleados"
                  title="Ventas Totales"
                  onEditar={iniciarEdicion}
               />;

      case 'editarVenta':
        if (!idVentaAEditar) {
          setVistaActual('inicio');
          return null;
        }
        return <EmpleadoEditarVenta
                  onVolver={handleVolver}
                  idVentaE={idVentaAEditar}
               />;

      case 'inicio':
      default:
        return <VistaInicialCards onNavegar={navegarA} user={user} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavbarEmpleado />
      <main className="flex-1"> 
        {renderizarVista()}
      </main>
    </div>
  );
};

export default PanelEmpleados;