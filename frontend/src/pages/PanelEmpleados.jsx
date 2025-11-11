import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import NavbarEmpleado from "../components/NavbarEmpleado";
import VistaInicialCardsEmpleado from "../components/VistiaInicialCardsEmpleado";
import EmpleadoRealizarVenta from "../components/EmpleadoRealizarVenta";
import EmpleadoListaVentas from "../components/EmpleadoListaVentas";
import EmpleadoEditarVenta from "../components/EmpleadoEditarVenta"; 


const PanelEmpleados = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [vistaActual, setVistaActual] = useState('inicio');
  const [idVentaAEditar, setIdVentaAEditar] = useState(null);

  useEffect(() => {
    if (!user || user.rol !== 'empleado') {
        toast.error("Acceso no autorizado.");
        navigate('/login');
        return;
    }
  }, [user, navigate]);

  const handleVolver = () => setVistaActual('inicio');
  
  const navegarA = (vista) => {
    setIdVentaAEditar(null); // Limpiamos el ID al navegar a cualquier otra vista
    setVistaActual(vista);
  };

  // 3. ¡NUEVA FUNCIÓN! Se la pasamos a la lista
  const iniciarEdicion = (idVenta) => {
    setIdVentaAEditar(idVenta); // 1. Guardamos el ID
    setVistaActual('editarVenta'); // 2. Cambiamos a la vista de edición
  };

  // Si el usuario no existe, muestra "Cargando"
  if (!user) {
      return (
          <div className="flex justify-center items-center h-screen">
              <p>Cargando...</p>
          </div>
      );
  }

  // 4. Función que decide qué componente renderizar (ACTUALIZADA)
  const renderizarVista = () => {
    switch (vistaActual) {
      case 'venta':
        return <EmpleadoRealizarVenta 
                  onVolver={handleVolver} 
                  onVentaExitosa={() => navegarA('misVentas')} 
               />;
      
      case 'misVentas':
        // 5. ¡AQUÍ! Le pasamos la nueva función 'onEditar'
        return <EmpleadoListaVentas 
                  onVolver={handleVolver}
                  endpoint={`/ventasEmpleados/${user.id}`}
                  title="Mis Ventas Personales"
                  onEditar={iniciarEdicion}
               />;
        
      case 'productos':
         return (
            <div className="p-6 max-w-7xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
                <p className="mt-2 text-gray-600">(Componente en desarrollo...)</p>
                <button onClick={handleVolver} className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                    ⬅ Volver al Panel
                </button>
            </div>
        );
      
      case 'ventasTotales':
         // 5. ¡AQUÍ TAMBIÉN! Le pasamos la nueva función 'onEditar'
         return <EmpleadoListaVentas 
                  onVolver={handleVolver}
                  endpoint="/ventasEmpleados"
                  title="Ventas Totales"
                  onEditar={iniciarEdicion}
               />;

      // --- ¡NUEVA VISTA! ---
      case 'editarVenta':
        // Si no hay ID, volvemos al inicio (seguridad)
        if (!idVentaAEditar) {
          setVistaActual('inicio');
          return null;
        }
        return <EmpleadoEditarVenta
                  onVolver={handleVolver}  // Para volver a la lista
                  idVentaE={idVentaAEditar} // ¡Le pasamos el ID!
               />;

      case 'inicio':
      default:
        // Renderiza las cards (este componente ya está limpio)
        return <VistaInicialCardsEmpleado onNavegar={navegarA} user={user} />;
    }
  };

  // Renderizado final: Navbar + la vista que toque
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