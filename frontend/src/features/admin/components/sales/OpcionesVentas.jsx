import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LayoutDashboard } from "lucide-react";
import VentasSwitch from "./components/VentasSwitch";
import AdminVentasE from "./AdminVentasE";
import AdminVentasO from "./AdminVentasO";

const OpcionesVentas = () => {
  const [activeOption, setActiveOption] = useState("empleados");

  const handleOptionChange = (option) => {
    setActiveOption(option);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con Switch - Mobile First */}
      <header
        className="bg-white shadow-sm border-b border-gray-200"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Header Info - Mobile optimizado */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-start gap-3 mb-2">
              <div
                className="p-2 bg-primary-50 rounded-lg shrink-0"
                aria-hidden="true"
              >
                <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight"
                  id="page-title"
                >
                  Gestión de Ventas
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 leading-relaxed">
                  Administra ventas de empleados y pedidos online
                </p>
              </div>
            </div>
          </div>

          {/* Switch de Ventas - Responsive */}
          <VentasSwitch
            activeOption={activeOption}
            onOptionChange={handleOptionChange}
          />
        </div>
      </header>

      {/* Contenedor del módulo activo */}
      <main role="main" aria-labelledby="page-title">
        {activeOption === "empleados" ? <AdminVentasE /> : <AdminVentasO />}
      </main>

      {/* Toast global para notificaciones - Responsive */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        className="mt-16 sm:mt-0"
      />
    </div>
  );
};

export default OpcionesVentas;
