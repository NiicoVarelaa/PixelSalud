import { Link } from "react-router-dom";
import NavbarAvatar from "./NavbarAvatar";

import { ChevronDown, User, ShoppingBag, LogOut, Truck } from "lucide-react";

const NavbarMenuUsuario = ({
  cliente,
  handleLogout,
  setIsProfileDropdownOpen,
}) => {

  const capitalizeName = (name) =>
    name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const nombreCompleto = capitalizeName(cliente?.nombreCliente || "Usuario");

  return (
    <div className="absolute right-0 mt-4 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden transition-all duration-200 ease-in-out transform origin-top-right">
      <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-lg font-semibold text-gray-800">
            Bienvenido
          </p>
          <button 
            onClick={() => setIsProfileDropdownOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronDown className="transform rotate-180 cursor-pointer w-4 h-4" /> 
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <NavbarAvatar cliente={cliente} size="medium" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {nombreCompleto}
            </p>
            <p className="text-xs text-gray-600 truncate">{cliente.email}</p>
          </div>
        </div>
      </div>

      <div>
        <Link
          to="/perfil"
          onClick={() => setIsProfileDropdownOpen(false)}
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-150"
        >
          <User size={16} className="text-gray-700 " />
          Mi Perfil
        </Link>

        <Link
          to="/mis-compras"
          onClick={() => setIsProfileDropdownOpen(false)}
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-150 border-t border-gray-100"
        >
          <ShoppingBag size={16} className="text-gray-700" />
          Mis Compras
        </Link>
        
        <Link
          to="/mis-pedidos"
          onClick={() => setIsProfileDropdownOpen(false)}
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-150 border-t border-gray-100"
        >
          <Truck size={16} className="text-gray-700" /> 
          Mis Pedidos
        </Link>

        <div className="border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-150 cursor-pointer"
          >
            <LogOut size={16} className="text-red-500" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarMenuUsuario;