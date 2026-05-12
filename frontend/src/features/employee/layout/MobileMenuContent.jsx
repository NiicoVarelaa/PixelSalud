import { NavLink } from "react-router-dom";

const MobileMenuContent = ({ user, onNavigate }) => (
  <nav className="flex flex-col p-4">
    {user?.rol === "empleado" && (
      <NavLink
        to="/panelempleados"
        onClick={onNavigate}
        className={({ isActive }) =>
          `py-3 px-4 rounded-lg transition-colors ${
            isActive ? "bg-primary-100 text-primary-700" : "hover:bg-gray-50"
          }`
        }
      >
        PANEL DE EMPLEADO
      </NavLink>
    )}
    {user?.rol === "medico" && (
      <NavLink
        to="/panelmedico"
        onClick={onNavigate}
        className={({ isActive }) =>
          `py-3 px-4 rounded-lg transition-colors ${
            isActive ? "bg-green-100 text-green-700" : "hover:bg-gray-50"
          }`
        }
      >
        PANEL MÉDICO
      </NavLink>
    )}
  </nav>
);

export default MobileMenuContent;
