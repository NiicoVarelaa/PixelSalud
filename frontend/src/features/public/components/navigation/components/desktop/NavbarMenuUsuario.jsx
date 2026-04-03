import { Link } from "react-router-dom";
import NavbarAvatar from "../NavbarAvatar";
import { USER_MENU_LINKS } from "../../constants";
import { capitalizeName } from "../../utils";

import {
  ChevronDown,
  User,
  ShoppingBag,
  LogOut,
  MapPin,
  Heart,
} from "lucide-react";

const ICONS_BY_PATH = {
  "/perfil": User,
  "/perfil/pedidos": ShoppingBag,
  "/perfil/direcciones": MapPin,
  "/perfil/favoritos": Heart,
};

const NavbarMenuUsuario = ({
  user,
  handleLogout,
  setIsProfileDropdownOpen,
}) => {
  const nombreCompleto = capitalizeName(user?.nombre);

  return (
    <div className="absolute right-0 mt-4 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden transition-all duration-200 ease-in-out transform origin-top-right">
      <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-lg font-semibold text-gray-800">Bienvenido</p>
          <button
            onClick={() => setIsProfileDropdownOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronDown className="transform rotate-180 cursor-pointer w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <NavbarAvatar user={user} size="medium" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {nombreCompleto}
            </p>
            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <div>
        {USER_MENU_LINKS.map((item, index) => {
          const Icon = ICONS_BY_PATH[item.to] || User;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsProfileDropdownOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-150 ${
                index > 0 ? "border-t border-gray-100" : ""
              }`}
            >
              <Icon size={16} className="text-gray-700" />
              {item.label}
            </Link>
          );
        })}

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
