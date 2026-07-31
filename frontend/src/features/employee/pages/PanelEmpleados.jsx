import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarEmpleado from "../layout/sidebar/SidebarEmpleado";

const PanelEmpleado = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.rol !== "empleado") {
      toast.error("Acceso no autorizado.");
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50 lg:h-dvh lg:flex-row lg:overflow-hidden">
      <SidebarEmpleado />

      <main className="flex min-h-0 flex-1 overflow-visible bg-gray-50 lg:h-full lg:overflow-hidden lg:p-6">
        <div className="flex w-full flex-1 flex-col p-4 lg:h-full lg:min-h-0 lg:p-0">
          <Outlet />
        </div>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        toastClassName="text-sm font-medium"
      />
    </div>
  );
};

export default PanelEmpleado;
