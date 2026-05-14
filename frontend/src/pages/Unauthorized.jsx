import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const goBack = () => navigate(-1);

  const getHomeRoute = () => {
    const rol = user?.rol;
    if (rol === "admin") return "/admin";
    if (rol === "empleado") return "/panelempleados";
    if (rol === "medico") return "/panelMedico";
    return "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert size={40} className="text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Acceso no autorizado</h1>
        <p className="mt-2 text-sm text-gray-500">
          No tenés permisos para acceder a esta sección. Si crees que esto es un error, contactá al administrador.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={goBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
          <Link
            to={getHomeRoute()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 cursor-pointer"
          >
            <Home size={16} />
            Ir a inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
