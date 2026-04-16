import { NavLink } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const Breadcrumbs = ({ categoria, customPaths }) => {
  const categoriaDisplay = capitalizeFirstLetter(categoria || "");

  return (
    <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex items-center space-x-2">
        <li className="flex items-center">
          <NavLink
            to="/"
            className="flex items-center gap-1 hover:text-primary-700 transition-colors"
          >
            <Home size={16} className="text-gray-500" />
            Inicio
          </NavLink>
        </li>

        {customPaths ? (
          customPaths.map((path, index) => (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight size={16} className="text-gray-400" />
              {path.current ? (
                <span className="font-medium text-gray-700">{path.label}</span>
              ) : path.onClick ? (
                <button
                  onClick={path.onClick}
                  className="hover:text-primary-700 transition-colors cursor-pointer"
                >
                  {path.label}
                </button>
              ) : (
                <NavLink
                  to={path.to}
                  className="hover:text-primary-700 transition-colors"
                >
                  {path.label}
                </NavLink>
              )}
            </li>
          ))
        ) : (
          <li className="flex items-center space-x-2">
            <ChevronRight size={16} className="text-gray-400" />
            {categoria === "todos" || !categoria ? (
              <span className="font-medium text-gray-700">Productos</span>
            ) : (
              <>
                <NavLink
                  to="/productos"
                  className="hover:text-primary-700 transition-colors"
                >
                  Productos
                </NavLink>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="font-medium text-gray-700">
                  {categoriaDisplay}
                </span>
              </>
            )}
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
