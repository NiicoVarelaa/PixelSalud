import { Link, NavLink } from "react-router-dom";
import {
  X,
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Heart,
  Tag,
  MapPin,
} from "lucide-react";
import NavbarAvatar from "./NavbarAvatar";
import { NavbarCategoriesDropdown } from "./NavbarCategoriesDropdown";
import LogoPixelSalud from "@assets/LogoPixelSalud.webp";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useCarritoStore } from "@store/useCarritoStore";

const capitalizeName = (name) =>
  name
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ") || "Usuario";

const NavbarMenuCelular = ({
  isMenuOpen,
  setIsMenuOpen,
  menuRef,
  navLinks,
  user,
  handleLogout,
  totalItems = 0,
}) => {
  const nombreUsuarioCapitalizado = capitalizeName(user?.nombre);
  const [isCategoriasOpen, setIsCategoriasOpen] = useState(false);
  const categoriasRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const { setIsCartModalOpen } = useCarritoStore();

  const handleCategoriaClick = (categoria) => {
    window.location.href = `/productos?categoria=${encodeURIComponent(categoria)}`;
    setIsCategoriasOpen(false);
    setIsMenuOpen(false);
  };

  // Enfocar el primer elemento al abrir
  useEffect(() => {
    if (isMenuOpen) {
      firstFocusableRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setIsMenuOpen]);

  // Trampa de foco básica
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current?.focus();
        }
      } else {
        if (document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    }
  };

  // El overlay usa tween corto para que el blur aparezca al instante.
  const overlayTransition = { duration: 0.18, ease: "easeOut" };
  const panelTransition = { duration: 0.24, ease: [0.22, 1, 0.36, 1] };

  return (
    <AnimatePresence initial={false}>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 backdrop-blur-sm"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0 }}
            aria-hidden="true"
          />

          <motion.div
            className="absolute inset-0 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Panel del menú */}
          <motion.div
            ref={menuRef}
            className="absolute top-0 right-0 h-full w-full max-w-xs bg-white shadow-xl flex flex-col overflow-hidden" // ← overflow-hidden clave
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={panelTransition}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            onKeyDown={handleKeyDown}
          >
            {/* Cabecera (sin cambios) */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Ir a inicio"
              >
                <img
                  src={LogoPixelSalud}
                  alt="Pixel Salud"
                  className="w-32 h-auto"
                />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Perfil de usuario (si está autenticado) */}
            {user && (
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <NavbarAvatar user={user} size="medium" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {nombreUsuarioCapitalizado}
                    </p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navegación principal */}
            <nav
              className="flex flex-col grow p-4 overflow-y-auto"
              aria-label="Navegación principal"
            >
              {/* Dropdown de categorías (mobile) */}
              <NavbarCategoriesDropdown
                isCategoriasOpen={isCategoriasOpen}
                setIsCategoriasOpen={setIsCategoriasOpen}
                categoriasRef={categoriasRef}
                handleCategoriaClick={handleCategoriaClick}
                mobileMode={true}
              />

              {/* Link de ofertas (ícono a la derecha) */}
              <NavLink
                to="/ofertas"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 mb-3 px-1 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                    isActive
                      ? "text-primary-700 bg-primary-50"
                      : "text-primary-700 hover:text-primary-800 hover:bg-primary-50"
                  }`
                }
              >
                <span className="uppercase">Ofertas</span>
                <motion.span
                  whileHover={{ scale: 1.18, rotate: 12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <Tag className="w-5 h-5 text-primary-700" />
                </motion.span>
              </NavLink>

              {navLinks.map(({ to, label }, index) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block mb-3 px-1 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                      isActive
                        ? "text-primary-700 bg-primary-50"
                        : "text-gray-700 hover:text-primary-700 hover:bg-gray-50"
                    }`
                  }
                  ref={index === 0 ? firstFocusableRef : null}
                >
                  {label}
                </NavLink>
              ))}

              <hr className="my-4 border-t border-gray-200" />

              {user ? (
                <>
                  <NavLink
                    to="/perfil"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-1 rounded-md text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <User className="w-5 h-5" aria-hidden="true" />
                    Perfil
                  </NavLink>
                  <Link
                    to="/perfil/pedidos"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-1 rounded-md text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                    Pedidos
                  </Link>
                  <Link
                    to="/perfil/direcciones"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-1 rounded-md text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                    Direcciones
                  </Link>
                  <Link
                    to="/perfil/favoritos"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-1 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <Heart className="w-5 h-5" aria-hidden="true" /> Favoritos
                  </Link>

                  <hr className="my-4 border-t border-gray-200" />

                  <button
                    onClick={() => {
                      setIsCartModalOpen(true);
                      setIsMenuOpen(false);
                    }}
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
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-3 px-1 rounded-md text-base font-medium w-full text-red-600 hover:text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    ref={lastFocusableRef}
                  >
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-1 rounded-md text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  ref={firstFocusableRef}
                >
                  <User className="w-5 h-5" aria-hidden="true" />
                  Ingresar
                </NavLink>
              )}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavbarMenuCelular;
