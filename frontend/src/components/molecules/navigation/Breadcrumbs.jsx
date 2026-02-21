import { NavLink } from "react-router-dom";

import { ChevronRight, Home } from "lucide-react"; 

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const Breadcrumbs = ({ categoria }) => {
  const categoriaDisplay = capitalizeFirstLetter(categoria || '');

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
        
        {/* Separador */}
        <li className="flex items-center">
          <ChevronRight size={16} className="text-gray-400" />
        </li>

        <li className="flex items-center">
          {categoria === "todos" || !categoria ? (
            <span className="font-medium text-gray-700">Productos</span>
          ) : (
            <>
              <NavLink to="/productos" className="hover:text-primary-700 transition-colors">
                Productos
              </NavLink>
              
              <span className="mx-2 flex items-center">
                <ChevronRight size={16} className="text-gray-400" />
              </span>
              
              <span className="font-medium text-gray-700">
                {categoriaDisplay}
              </span>
            </>
          )}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;