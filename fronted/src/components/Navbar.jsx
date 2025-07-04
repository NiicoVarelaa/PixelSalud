// Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { useCarritoStore } from "../store/useCarritoStore";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LogoPixelSalud from "../assets/LogoPixelSalud.webp";
import profileIcon from "../assets/iconos/profile_icon.png";
import cartIcon from "../assets/iconos/cart_icon.png";
import menuIcon from "../assets/iconos/menu_icon.png";
import logout from "../assets/iconos/logout.png";
import { getCliente } from "../store/useClienteStore";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";
import { Navigate } from "react-router-dom";

const Navbar = () => {
  const carrito = useCarritoStore((state) => state.carrito);
  const sincronizarCarrito = useCarritoStore(
    (state) => state.sincronizarCarrito
  );
  const navigate = useNavigate()
  const totalItems = carrito.reduce(
    (acc, item) => acc + (item.cantidad || 0),
    0
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [loggedInClienteId, setLoggedInClienteId] = useState(null); // Estado para el ID del cliente logueado
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    // Sincroniza el carrito al cargar el componente
    sincronizarCarrito();

    // Función para obtener el ID del cliente logueado
    const fetchClienteId = async () => {
      const id = await getCliente();
      setLoggedInClienteId(id); // Actualiza el estado con el ID del cliente o null/undefined
      console.log("Navbar useEffect: loggedInClienteId actualizado a:", id);
    };

    fetchClienteId(); // Llama a la función al montar el componente

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [sincronizarCarrito]); // Dependencia para resincronizar si cambia la función (aunque es constante)

  const handleLogout = async () => {
    try {
      // Si hay un ID de cliente logueado, se envía la petición de logout
      if (loggedInClienteId) {
        await axios.put(
          `http://localhost:5000/clientes/${loggedInClienteId}/logout`
        );
      }
      setLoggedInClienteId(null); // Limpia el ID del cliente logueado en el estado
      setIsProfileDropdownOpen(false); // Cierra el dropdown
      setIsMenuOpen(false); // Cierra el menú móvil
      navigate("/")
      
      console.log("Usuario deslogueado correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium relative">
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
        <div className="group relative" ref={profileRef}>
          {/* Lógica condicional para el icono de perfil/dropdown */}
          {loggedInClienteId ? ( // Si hay un ID de cliente, muestra el botón para el dropdown
            <>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-6 h-6 cursor-pointer text-gray-700 hover:text-primary-700 transition-colors duration-200 flex items-center justify-center"
                aria-label="Abrir menú de perfil"
              >
                <img
                  src={profileIcon}
                  className="w-5 cursor-pointer"
                  alt="profileIcon"
                />
              </button>
              {isProfileDropdownOpen && ( // Si el dropdown está abierto, lo muestra
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
                  
                  <Link
                    to="/MisCompras"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-700 transition-colors duration-200"
                  >
                    <img src={cartIcon} className="w-5 min-w-5" alt="cartIcon" />
                    Mis Compras
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                  >
                    <img
                      src={logout}
                      className="w-5 cursor-pointer"
                      alt="profileIcon"
                    />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </>
          ) : (

            // Si no hay ID de cliente, redirige a la página de login
            <NavLink to="/login">

              <img
                src={profileIcon}
                className="w-5 cursor-pointer"
                alt="profileIcon"
              />
            </NavLink>
          )}
        </div>

        <Link to="/carrito" className="relative">
          <img src={cartIcon} className="w-5 min-w-5" alt="cartIcon" />
          {totalItems > 0 && (
            <span className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-primary-700 text-white aspect-square rounded-full text-[8px]">
              {totalItems}
            </span>
          )}
        </Link>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="w-5 cursor-pointer sm:hidden"
          aria-label="Abrir menú"
        >
          <img src={menuIcon} alt="menuIcon" />
        </button>
      </div>

      {/* Menú móvil - Diseño mejorado */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay oscuro para el fondo */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition duration-300"></div>

        <div
          ref={menuRef}
          className={`absolute top-0 right-0 h-full w-full max-w-xs bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Encabezado del menú móvil */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <img
                className="w-auto h-8"
                src={LogoPixelSalud}
                alt="Logo Pixel Salud"
              />
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-full cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Cerrar menú"
            >
              <IoCloseSharp className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col flex-grow p-4 overflow-y-auto">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg text-lg font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              INICIO
            </NavLink>
            <NavLink
              to="/productos"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg text-lg font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              TIENDA
            </NavLink>
            <NavLink
              to="/sobreNosotros"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg text-lg font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              NOSOTROS
            </NavLink>
            <NavLink
              to="/contacto"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg text-lg font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              CONTACTO
            </NavLink>

            {/* Opciones de cuenta para el menú móvil */}
            <hr className="my-4 border-t border-gray-200" />
            {loggedInClienteId ? ( // Si hay un ID de cliente logueado
              <>
                
                <Link
                  to="/MisCompras"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg text-lg text-gray-700 hover:bg-gray-100 hover:text-primary-700 transition-colors duration-200"
                >
                  <img src={cartIcon} className="w-5 min-w-5" alt="cartIcon" />
                  Mis Compras
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg text-lg text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-200"
                >
                  <img
                    src={logout}
                    className="w-5 cursor-pointer"
                    alt="profileIcon"
                  />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              // Si no hay ID de cliente logueado, muestra el enlace para iniciar sesión
              <NavLink
                to="login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-lg text-lg text-gray-700 hover:bg-gray-100 hover:text-primary-700 transition-colors duration-200"
              >
                <img
                  src={profileIcon}
                  className="w-5 cursor-pointer"
                  alt="profileIcon"
                />
                Iniciar Sesión
              </NavLink>
            )}
          </nav>

          {/* Pie de página del menú móvil (Ejemplo para el carrito) */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/carrito"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-lg font-semibold bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
            >
              <img src={cartIcon} className="w-5 min-w-5" alt="cartIcon" />
              Carrito ({totalItems})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;