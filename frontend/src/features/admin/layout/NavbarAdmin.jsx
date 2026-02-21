import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import LogoPixelSalud from "@assets/LogoPixelSalud.webp";
// Usamos iconos vectoriales de lucide-react para mayor nitidez y consistencia
import { Menu, User, LogOut, X } from "lucide-react";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  // (El useEffect se mantiene igual, funciona bien para cerrar los menús)
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

  const handleLogout = () => {
    logoutUser();
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const isAuthorized =
    user && (user.rol === "admin" || user.rol === "empleado");

  return (
    // --- CAMBIO 1: Estilo moderno del contenedor principal (blanco, sticky, sombra sutil) ---
    <nav className="sticky top-0 z-50 w-full bg-secondary-100 backdrop-blur-md border-b border-gray-100 shadow-sm py-4 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* --- SECCIÓN IZQUIERDA (Logo) - Ocupa 1/3 del espacio y se alinea a la izquierda --- */}
        <div className="flex-1 flex justify-start">
          <Link>
            <img
              className="w-28 sm:w-32 h-auto transition-transform hover:scale-105"
              src={LogoPixelSalud}
              alt="Logo Pixel Salud"
            />
          </Link>
        </div>

        {/* --- SECCIÓN CENTRAL (Links) - Ocupa 1/3 y se centra perfectamente --- */}
        <div className="flex-1 flex justify-center">
          {isAuthorized && (
            // Oculto en móviles, visible en tablets/escritorio
            <ul className="hidden md:flex gap-8 font-semibold text-gray-600">
              <NavLink
                to="/admin"
                // Efecto moderno de subrayado animado al hacer hover
                className={({ isActive }) =>
                  `relative group py-2 ${isActive ? "text-primary-600" : "hover:text-primary-600"} transition-colors duration-300`
                }
              >
                <span>Panel de Administración</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
              </NavLink>
            </ul>
          )}
        </div>

        {/* --- SECCIÓN DERECHA (Perfil/Menú) - Ocupa 1/3 y se alinea a la derecha --- */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="relative" ref={profileRef}>
            {isAuthorized ? (
              <>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  aria-label="Abrir menú de perfil"
                >
                  <User size={22} />
                </button>

                {/* Dropdown de perfil mejorado */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {user.nombre} {user.apellido}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.rol}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 text-left"
                    >
                      <LogOut size={18} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center gap-2 font-bold text-primary-600 hover:text-primary-700 py-2 px-4 rounded-lg hover:bg-primary-50 transition-all"
              >
                <User size={20} />
                <span>Ingresar</span>
              </NavLink>
            )}
          </div>

          {/* Botón hamburguesa (visible solo en móviles) */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Abrir menú móvil"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* --- MENÚ MÓVIL (Drawer lateral) --- */}
      <div
        className={`fixed inset-0 z-50 ${isMenuOpen ? "" : "pointer-events-none"}`}
      >
        {/* Backdrop oscuro */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Panel lateral */}
        <div
          ref={menuRef}
          className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <img className="w-auto h-9" src={LogoPixelSalud} alt="Logo" />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col p-5 gap-2 overflow-y-auto">
            {isAuthorized && (
              <NavLink
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-xl font-semibold transition-all ${
                    isActive
                      ? "bg-primary-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                Panel de Administración
              </NavLink>
            )}
            {/* Aquí puedes agregar más enlaces para el móvil si es necesario */}
          </nav>

          <div className="p-5 border-t border-gray-100">
            {isAuthorized ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-sm transition-all duration-200"
              >
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-all duration-200"
              >
                <User size={20} />
                Iniciar Sesión
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
