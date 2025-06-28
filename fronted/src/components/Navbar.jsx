import { useState, useEffect, useRef } from "react";
import { useCarritoStore } from "../store/useCarritoStore";
import { Link, NavLink } from "react-router-dom";
import LogoPixelSalud from "../assets/LogoPixelSalud.webp";
import searchIcon from "../assets/iconos/search_icon.png";
import profileIcon from "../assets/iconos/profile_icon.png";
import cartIcon from "../assets/iconos/cart_icon.png";
import menuIcon from "../assets/iconos/menu_icon.png";
import closeIcon from "../assets/iconos/cross_icon.png";

const Navbar = () => {
  const carrito = useCarritoStore((state) => state.carrito);
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="flex items-center justify-between py-5 font-medium relative px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Link to="/">
        <img
          className="w-auto h-9"
          src={LogoPixelSalud}
          alt="Logo Pixel Salud"
        />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>INICIO</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-primary-700 hidden" />
        </NavLink>
        <NavLink to="/productos" className="flex flex-col items-center gap-1">
          <p>TIENDA</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-primary-700 hidden" />
        </NavLink>
        <NavLink
          to="/sobreNosotros"
          className="flex flex-col items-center gap-1"
        >
          <p>NOSOTROS</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-primary-700 hidden" />
        </NavLink>
        <NavLink to="/contacto" className="flex flex-col items-center gap-1">
          <p>CONTACTO</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-primary-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img src={searchIcon} className="w-5 cursor-pointer" alt="searchIcon" />
        <div className="group relative">
          <img
            src={profileIcon}
            className="w-5 cursor-pointer"
            alt="profileIcon"
          />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <p className="cursor-pointer hover:text-black">Mi cuenta</p>
              <p className="cursor-pointer hover:text-black">Pedidos</p>
              <p className="cursor-pointer hover:text-black">Cerrar sesión</p>
            </div>
          </div>
        </div>
        <Link to="/carrito" className="relative">
          <img src={cartIcon} className="w-5 min-w-5" alt="cartIcon" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-primary-700 text-white aspect-square rounded-full text-[8px]">
            {totalItems > 0 && (
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-primary-700 text-white aspect-square rounded-full text-[8px]">
                {totalItems}
              </p>
            )}
          </p>
        </Link>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="w-5 cursor-pointer sm:hidden"
          aria-label="Abrir menú"
        >
          <img src={menuIcon} alt="menuIcon" />
        </button>
      </div>

      {/* Menú móvil mejorado con fondo blur */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Fondo desenfocado */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm transition duration-300"></div>

        {/* Contenido del menú */}
        <div
          ref={menuRef}
          className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Encabezado del menú */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <img
              className="w-auto h-9"
              src={LogoPixelSalud}
              alt="Logo Pixel Salud"
            />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-full cursor-pointer"
              aria-label="Cerrar menú"
            >
              <img src={closeIcon} className="w-5" alt="Cerrar menú" />
            </button>
          </div>

          {/* Elementos del menú */}
          <nav className="flex flex-col p-4">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "hover:bg-gray-50"
                }`
              }
            >
              INICIO
            </NavLink>
            <NavLink
              to="/productos"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "hover:bg-gray-50"
                }`
              }
            >
              TIENDA
            </NavLink>
            <NavLink
              to="/sobreNosotros"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "hover:bg-gray-50"
                }`
              }
            >
              NOSOTROS
            </NavLink>
            <NavLink
              to="/contacto"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "hover:bg-gray-50"
                }`
              }
            >
              CONTACTO
            </NavLink>
          </nav>

          {/* Pie del menú con acciones de usuario */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <img src={profileIcon} className="w-6" alt="Perfil" />
              <span className="text-gray-700">Mi cuenta</span>
            </div>
            <div className="flex items-center gap-4">
              <img src={cartIcon} className="w-6" alt="Carrito" />
              <span className="text-gray-700">Carrito ({totalItems})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
