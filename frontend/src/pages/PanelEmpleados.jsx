import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import NavbarEmpleado from "../components/NavbarEmpleado";
import EmpleadoListaVentas from "../components/EmpleadoListaVentas"; // ¡Asegurate que esta ruta sea correcta!
import EmpleadoRealizarVenta from "../components/EmpleadoRealizarVenta";

// ===================================================================
// --- VISTA INICIAL (Las Cards) ---
// ===================================================================
// 1. Recibimos el 'user' como prop
const VistaInicialCards = ({ onNavegar, user }) => {
  return (
    // 2. Este wrapper centra todo (vertical y horizontalmente) en el espacio disponible
    <div className="flex flex-col items-center justify-center h-full p-6">
      {/* 3. Título centrado con el nombre del empleado */}
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        {/* Usamos 'nombreEmpleado' o 'nombre', con un fallback por si acaso */}
        Bienvenido {user?.nombreEmpleado || user?.nombre || "Empleado"} !!
      </h1>

      {/* 4. Subtítulo centrado */}
      <p className="text-lg text-gray-600 text-center mt-2 mb-12">
        Selecciona una opcion.
      </p>

      {/* 5. Contenedor de Cards (el 'gap-8' da la distancia que pediste) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          onClick={() => onNavegar("venta")}
          className="group p-8 bg-white rounded-xl shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-xl hover:bg-blue-50"
        >
          <span className="text-6xl">🛒</span>
          <h2 className="text-2xl font-semibold mt-4 text-gray-800 group-hover:text-blue-600">
            Realizar Venta
          </h2>
          <p className="text-gray-500 mt-1">
            Iniciar un nuevo ticket de venta.
          </p>
        </div>

        <div
          onClick={() => onNavegar("misVentas")}
          className="group p-8 bg-white rounded-xl shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-xl hover:bg-green-50"
        >
          <span className="text-6xl">👤</span>
          <h2 className="text-2xl font-semibold mt-4 text-gray-800 group-hover:text-green-600">
            Mis Ventas
          </h2>
          <p className="text-gray-500 mt-1">Ver mi historial de ventas.</p>
        </div>

        <div
          onClick={() => onNavegar("productos")}
          className="group p-8 bg-white rounded-xl shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-xl hover:bg-yellow-50"
        >
          <span className="text-6xl">📦</span>
          <h2 className="text-2xl font-semibold mt-4 text-gray-800 group-hover:text-yellow-600">
            Productos
          </h2>
          <p className="text-gray-500 mt-1">Ver y gestionar stock.</p>
        </div>
      </div>
    </div>
  );
};

// ===================================================================
// --- COMPONENTE PADRE (Controlador) ---
// ===================================================================
const PanelEmpleados = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState("inicio");

  useEffect(() => {
    if (!user || user.rol !== "empleado") {
      toast.error("Acceso no autorizado.");
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleVolver = () => setVistaActual("inicio");
  const navegarA = (vista) => setVistaActual(vista);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  const renderizarVista = () => {
    switch (vistaActual) {
      case "venta":
        return (
          <EmpleadoRealizarVenta
            onVolver={handleVolver}
            onVentaExitosa={() => navegarA("misVentas")} // <--- ¡Esta línea es nueva!
          />
        );
      case "misVentas":
        return (
          <EmpleadoListaVentas
            onVolver={handleVolver}
            endpoint={`/ventasEmpleados/${user.id}`} // Le pasa la URL para "Mis Ventas"
            title="Mis Ventas Personales"
          />
        );
      // ...
      case "ventasTotales":
        return (
          <EmpleadoListaVentas
            onVolver={handleVolver}
            endpoint="/ventasEmpleados" // Le pasa la URL para "Ventas Totales"
            title="Ventas Totales (Admin)"
          />
        );

      case "productos":
        return (
          <div className="p-6">
            <h1 className="text-2xl">Gestión de Productos (Próximamente)</h1>
            <button
              onClick={handleVolver}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Volver
            </button>
          </div>
        );

      case "inicio":
      default:
        // 6. ¡Importante! Le pasamos el 'user' a la vista de cards
        return <VistaInicialCards onNavegar={navegarA} user={user} />;
    }
  };

  return (
    // 7. Hacemos que el contenedor principal sea una columna flex
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavbarEmpleado />
      {/* 8. Este 'main' ocupa el resto de la pantalla y permite centrar el contenido */}
      <main className="flex-1">{renderizarVista()}</main>
    </div>
  );
};

export default PanelEmpleados;
