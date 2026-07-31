import { Link, NavLink } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Heart,
  MapPin,
} from "lucide-react";
import { USER_MENU_LINKS } from "../../constants";

const ICONS_BY_PATH = {
  "/perfil": User,
  "/perfil/pedidos": ShoppingBag,
  "/perfil/direcciones": MapPin,
  "/perfil/favoritos": Heart,
};

const NavbarMobileAccountActions = ({
  user,
  totalItems,
  onCloseMenu,
  onCartOpen,
  onLogout,
}) => {
  if (!user) {
    return (
      <NavLink
        to="/login"
        onClick={onCloseMenu}
        className="flex items-center gap-3 py-3 px-1 rounded-md text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <User className="w-5 h-5" aria-hidden="true" />
        Ingresar
      </NavLink>
    );
  }

  return (
    <>
      {USER_MENU_LINKS.map((item) => {
        const Icon = ICONS_BY_PATH[item.to] || User;
        const isFavoritos = item.to === "/perfil/favoritos";

        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onCloseMenu}
            className={`flex items-center gap-3 py-3 px-1 rounded-md text-base font-medium hover:bg-gray-50 focus:outline-none focus-visible:ring-2 ${
              isFavoritos
                ? "text-gray-700 hover:text-red-500 focus-visible:ring-red-500"
                : "text-gray-700 hover:text-primary-700 focus-visible:ring-primary-500"
            }`}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}

      <hr className="my-4 border-t border-gray-200" />

      <button
        onClick={onCartOpen}
        className="flex items-center justify-between py-3 px-1 rounded-md text-base font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 mb-2 w-full"
      >
        <span className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5" aria-hidden="true" />
          Ver Carrito
        </span>
        <span className="bg-primary-700 text-white px-2 py-1 rounded-full text-xs font-medium">
          {totalItems} {totalItems === 1 ? "ítem" : "ítems"}
        </span>
      </button>

      <hr className="my-4 border-t border-gray-200" />

      <button
        onClick={onLogout}
        className="flex items-center gap-3 py-3 px-1 rounded-md text-base font-medium w-full text-red-600 hover:text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <LogOut className="w-5 h-5" aria-hidden="true" />
        Cerrar Sesión
      </button>
    </>
  );
};

export default NavbarMobileAccountActions;
