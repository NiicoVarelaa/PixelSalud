import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import NavbarEmpleado from "../components/NavbarEmpleado";

// --- Importamos TODAS las vistas que este panel puede mostrar ---
import VistaInicialCardsEmpleado from "../components/VistiaInicialCardsEmpleado"; // ¡El nuevo componente!
import EmpleadoRealizarVenta from "../components/EmpleadoRealizarVenta";
import EmpleadoListaVentas from "../components/EmpleadoListaVentas";
// import EmpleadoProductos from "../components/EmpleadoProductos"; // (Para el futuro)

// ===================================================================
// --- COMPONENTE PADRE (Controlador) ---
// ===================================================================
const PanelEmpleados = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Estado que controla qué vista mostramos: 'inicio' (cards) o 'venta', etc.
  const [vistaActual, setVistaActual] = useState('inicio');

  // Protección de la ruta (esto ya lo tenías bien)
  useEffect(() => {
    if (!user || user.rol !== 'empleado') {
        toast.error("Acceso no autorizado.");
        navigate('/login'); // Redirige si no es empleado
        return;
    }
  }, [user, navigate]);

  // Función para volver al menú de cards (se la pasamos a los hijos)
  const handleVolver = () => setVistaActual('inicio');

  // Función para cambiar de vista (se la pasamos a las cards)
  const navegarA = (vista) => setVistaActual(vista);

  // Si el usuario aún no cargó (ej: F5), muestra "Cargando..."
  if (!user) {
      return (
          <div className="flex justify-center items-center h-screen">
              <p>Cargando...</p>
          </div>
      );
  }

  // Función que decide qué componente renderizar
  const renderizarVista = () => {
    switch (vistaActual) {
      case 'venta':
        return <EmpleadoRealizarVenta 
                  onVolver={handleVolver} 
                  onVentaExitosa={() => navegarA('misVentas')} 
               />;
      
      case 'misVentas':
        // Le pasamos la prop 'onEditar' VACÍA por ahora (la usaremos después)
        return <EmpleadoListaVentas 
                  onVolver={handleVolver}
                  endpoint={`/ventasEmpleados/${user.id}`}
                  title="Mis Ventas Personales"
                  onEditar={() => {}} // TODO: Implementar navegación a Editar
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
         return <EmpleadoListaVentas 
                  onVolver={handleVolver}
                  endpoint="/ventasEmpleados"
                  title="Ventas Totales (Admin)"
                  onEditar={() => {}} // TODO: Implementar navegación a Editar
               />;

      case 'inicio':
      default:
        // Renderiza las cards y les pasa el 'user' y la función para navegar
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