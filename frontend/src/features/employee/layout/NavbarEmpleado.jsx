import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore"; // Store
import LogoPixelSalud from "@assets/LogoPixelSalud.webp";
import profileIcon from "@assets/iconos/profile_icon.png";
import logoutIcon from "@assets/iconos/logout.png";
import closeIcon from "@assets/iconos/cross_icon.png";
import { Menu } from "lucide-react";

const NavbarEmpleado = () => {
  const navigate = useNavigate();

  // 1. Traemos usuario y la función logoutUser
  const { user, logoutUser } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  // Clic fuera para cerrar menús
  useEffect(() => {
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
  }, []);

  // 2. LÓGICA DE LOGOUT CORREGIDA
  const handleLogout = () => {
    // Primero: Borra todo del store y del storage
    logoutUser();

    // Segundo: Cierra menús visuales
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);

    // Tercero: Redirige al login (ahora sí, limpio)
    navigate("/login");
  };

  // Verificamos si hay usuario logueado (para mostrar menú o login)
  const isAuthorized = !!user;

  return (
    <div className="py-5 font-medium relative bg-secondary-100 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="flex items-center justify-between w-full mx-auto">
        {/* LOGO */}
        <Link to={user?.rol === "medico" ? "/panelmedico" : "/panelempleados"}>
          <img
            className="w-auto h-9"
            src={LogoPixelSalud}
            alt="Logo Pixel Salud"
          />
        </Link>

        {/* LINKS CENTRALES (Solo si es empleado mostramos el texto Panel) */}
        {user?.rol === "empleado" && (
          <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
            <NavLink
              to="/panelempleados"
              className="flex flex-col items-center gap-1 transition transform hover:scale-105 hover:text-green-500 duration-300"
            >
              <p>PANEL DE EMPLEADO</p>
            </NavLink>
          </ul>
        )}

        {/* Si es médico mostramos Panel Médico */}
        {user?.rol === "medico" && (
          <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
            <NavLink
              to="/panelmedico"
              className="flex flex-col items-center gap-1 transition transform hover:scale-105 hover:text-blue-500 duration-300"
            >
              <p>PANEL MÉDICO</p>
            </NavLink>
          </ul>
        )}

        {/* PERFIL / LOGIN */}
        <div className="flex items-center gap-6">
          <div className="group relative" ref={profileRef}>
            {isAuthorized ? (
              <>
                {/* Icono de Perfil (Botón) */}
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="w-6 h-6 cursor-pointer text-gray-700 hover:text-primary-700 transition-colors duration-200 flex items-center justify-center"
                  aria-label="Abrir menú de perfil"
                >
                  <img
                    src={profileIcon}
                    className="w-5 cursor-pointer"
                    alt="profileIcon"
                  />
                </button>

                {/* Dropdown Desktop */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500">Conectado como:</p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {user.nombre} {user.apellido}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                    >
                      <img
                        src={logoutIcon}
                        className="w-5 cursor-pointer"
                        alt="logoutIcon"
                      />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </>
            ) : (
              <NavLink to="/login">
                <img
                  src={profileIcon}
                  className="w-5 cursor-pointer"
                  alt="profileIcon"
                />
              </NavLink>
            )}
          </div>

          {/* Botón Hamburguesa Móvil */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="sm:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL (Overlay) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

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
            {user?.rol === "empleado" && (
              <NavLink
                to="/panelempleados"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "hover:bg-gray-50"
                  }`
                }
              >
                PANEL DE EMPLEADO
              </NavLink>
            )}
            {user?.rol === "medico" && (
              <NavLink
                to="/panelmedico"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `py-3 px-4 rounded-lg transition-colors ${
                    isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-50"
                  }`
                }
              >
                PANEL MÉDICO
              </NavLink>
            )}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            {isAuthorized ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-200"
              >
                <img
                  src={logoutIcon}
                  className="w-5 cursor-pointer"
                  alt="logoutIcon"
                />
                Cerrar Sesión
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary-700 transition-colors duration-200"
              >
                <img
                  src={profileIcon}
                  className="w-5 cursor-pointer"
                  alt="profileIcon"
                />
                Iniciar Sesión
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarEmpleado;
