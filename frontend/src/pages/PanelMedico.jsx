import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import { NavbarEmpleado } from "@features/employee/layout";
import { SidebarMedico } from "@features/medical/layout";

const PanelMedico = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Protección de ruta
  useEffect(() => {
    if (!user || user.rol !== "medico") {
      toast.error("Acceso exclusivo para médicos.");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...
      </div>
    );

  // Lógica para saber si estamos en el inicio (Menu de Cards)
  // Agregamos chequeo para ruta con o sin barra final
  const esInicio =
    location.pathname === "/panelMedico" ||
    location.pathname === "/panelMedico/";

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <NavbarEmpleado />

      <div className="flex flex-1 overflow-hidden">
        {/* El Sidebar se muestra SIEMPRE, excepto en el inicio */}
        {!esInicio && <SidebarMedico user={user} />}

        {/* Área Principal */}
        <main className="flex-1 overflow-y-auto relative bg-blue-50/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PanelMedico;
