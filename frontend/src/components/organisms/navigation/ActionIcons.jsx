import NavbarMenuUsuario from "@components/molecules/navigation/NavbarMenuUsuario";
import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  CircleUserRound,
  Heart,
  Search,
  ChevronDown,
} from "lucide-react";
import NavbarAvatar from "@components/molecules/navigation/NavbarAvatar";

export function ActionIcons({
  user,
  handleLogout,
  setIsSearchOpen,
  setIsMenuOpen,
  profileRef,
  isProfileDropdownOpen,
  setIsProfileDropdownOpen,
  menuRef,
  totalItems,
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Ícono de búsqueda - Solo Mobile */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.08 }}
        onClick={() => setIsSearchOpen((prev) => !prev)}
        className="md:hidden p-2 flex items-center justify-center"
        aria-label="Buscar productos"
        tabIndex={0}
      >
        <Search
          strokeWidth={1.5}
          className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700"
        />
      </motion.button>

      {user && (
        <Link
          to="/perfil/favoritos"
          className="relative p-2 flex items-center justify-center"
          aria-label="Ver mis productos favoritos"
          tabIndex={0}
        >
          <Heart
            strokeWidth={1.5}
            fill="none"
            className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 hover:text-red-500 hover:fill-red-500 transition-colors duration-100"
          />
        </Link>
      )}

      {user && (
        <Link
          to="/carrito"
          className="relative p-2 flex items-center justify-center"
          aria-label="Ver carrito"
          tabIndex={0}
        >
          <ShoppingCart
            strokeWidth={1.5}
            className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700"
          />
          {totalItems > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg drop-shadow-md ring-2 ring-emerald-300 animate-pulse"
              style={{ zIndex: 1 }}
            >
              {totalItems}
            </span>
          )}
        </Link>
      )}

      <div className="group relative" ref={profileRef}>
        {user ? (
          <>
            <button
              onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 p-2 transition-colors duration-200 cursor-pointer"
              aria-label="Abrir menú de perfil"
              aria-haspopup="true"
              aria-expanded={isProfileDropdownOpen}
              tabIndex={0}
            >
              <NavbarAvatar user={user} size="tiny" />
              <span className="hidden xl:block text-sm text-gray-700 hover:text-primary-700 font-semibold transition-colors duration-200">
                ¡Hola {user.nombre ? user.nombre.split(" ")[0] : "Mi cuenta"}!
              </span>
              <ChevronDown
                className={`ml-1 w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : "rotate-0"}`}
                aria-hidden="true"
              />
            </button>
            {isProfileDropdownOpen && (
              <NavbarMenuUsuario
                user={user}
                handleLogout={handleLogout}
                setIsProfileDropdownOpen={setIsProfileDropdownOpen}
              />
            )}
          </>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center gap-2 p-2"
            aria-label="Ingresar"
            tabIndex={0}
          >
            <CircleUserRound
              strokeWidth={1.5}
              className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700"
            />
            <span className="hidden xl:block text-sm text-gray-700">
              Ingresar
            </span>
          </NavLink>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.08 }}
        onClick={() => setIsMenuOpen(true)}
        className="w-8 h-8 flex items-center justify-center cursor-pointer lg:hidden"
        aria-label="Abrir menú"
        tabIndex={0}
        ref={menuRef}
      >
        <Menu
          strokeWidth={1.5}
          className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700"
        />
      </motion.button>
    </div>
  );
}
