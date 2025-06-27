import { useState, useEffect, useRef } from "react";
import { useCarritoStore } from "../store/useCarritoStore";
import { Link, NavLink } from "react-router-dom";
import LogoPixelSalud from "../assets/LogoPixelSalud.webp";
import profileIcon from "../assets/iconos/profile_icon.png";
import cartIcon from "../assets/iconos/cart_icon.png";
import menuIcon from "../assets/iconos/menu_icon.png";
import closeIcon from "../assets/iconos/cross_icon.png";

const Navbar = () => {
  const carrito = useCarritoStore((state) => state.carrito);
  const sincronizarCarrito = useCarritoStore(
    (state) => state.sincronizarCarrito
  );

  const totalItems = carrito.reduce(
    (acc, item) => acc + (item.cantidad || 0),
    0
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    sincronizarCarrito();

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
  }, [sincronizarCarrito]);

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
                <div className="group relative">
          <NavLink to="loginCliente">
            <img
              src={profileIcon}
              className="w-5 cursor-pointer"
              alt="profileIcon"
            />
          </NavLink>
        </div>

        <Link to="/carrito" className="relative">
          <img src={cartIcon} className="w-5 min-w-5" alt="cartIcon" />
<<<<<<< HEAD
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-primary-700 text-white aspect-square rounded-full text-[8px]">
=======
          <p>
>>>>>>> c693a1765897a5a403a7827e2e2c4b6ca88e97df
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

      {/* Menú móvil */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm transition duration-300"></div>

        <div
          ref={menuRef}
          className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
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

          <nav className="flex flex-col p-4">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 px-4 rounded-lg hover:bg-gray-50"
            >
              INICIO
            </NavLink>
            <NavLink
              to="/productos"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 px-4 rounded-lg hover:bg-gray-50"
            >
              TIENDA
            </NavLink>
            <NavLink
              to="/sobreNosotros"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 px-4 rounded-lg hover:bg-gray-50"
            >
              NOSOTROS
            </NavLink>
            <NavLink
              to="/contacto"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 px-4 rounded-lg hover:bg-gray-50"
            >
              CONTACTO
            </NavLink>
          </nav>

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
