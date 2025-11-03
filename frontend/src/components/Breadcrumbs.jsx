import { NavLink } from "react-router-dom";

import { ChevronRight } from "lucide-react";

const Breadcrumbs = ({ categoria }) => {
  return (
    <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex items-center space-x-2">
        <li className="flex items-center">
          <NavLink to="/" className="hover:text-primary-600 transition-colors">
            Inicio
          </NavLink>
        </li>
        <li className="flex items-center">
          <ChevronRight size={16} className="text-gray-400" />
        </li>
        <li className="flex items-center">
          {categoria === "todos" ? (
            <span className="font-medium text-gray-700">Productos</span>
          ) : (
            <>
              <NavLink to="/productos" className="hover:text-primary-600 transition-colors">
                Productos
              </NavLink>
              <span className="mx-2 flex items-center">
                <ChevronRight size={16} className="text-gray-400" />
              </span>
              <span className="font-medium text-gray-700 capitalize">
                {categoria}
              </span>
            </>
          )}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;