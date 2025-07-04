import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import axios from "axios";
import { getEmpleado } from "../store/useEmpleadoStore";
import LogoPixelSalud from "../assets/LogoPixelSalud.webp";
import profileIcon from "../assets/iconos/profile_icon.png";
import logoutIcon from "../assets/iconos/logout.png";
import closeIcon from "../assets/iconos/cross_icon.png";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [loggedInEmpleadoId, setLoggedInEmpleadoId] = useState(null);
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  // Al montar: obtener si hay empleado logueado + listeners de clic fuera/ESC
  useEffect(() => {
    const fetchEmpleadoId = async () => {
      const id = await getEmpleado();
      setLoggedInEmpleadoId(id);
      console.log("Empleado logueado:", id);
    };

    fetchEmpleadoId();

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

  const handleLogout = async () => {
    try {
      if (loggedInEmpleadoId) {
        await axios.put(
          `http://localhost:5000/Empleados/${loggedInEmpleadoId}/desloguear`
        );
      }
      setLoggedInEmpleadoId(null);
      setIsProfileDropdownOpen(false);
      setIsMenuOpen(false);
      navigate("/login");
      console.log("Empleado deslogueado correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="py-5 font-medium relative bg-secondary-100 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="flex items-center justify-between w-full mx-auto">
        <Link to="/">
          <img
            className="w-auto h-9"
            src={LogoPixelSalud}
            alt="Logo Pixel Salud"
          />
        </Link>

        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink
            to="/admin"
            className="flex flex-col items-center gap-1 transition transform hover:scale-105 hover:text-green-500 duration-300"
          >
            <p>PANEL DE ADMINISTRACION</p>
          </NavLink>
        </ul>

        <div className="flex items-center gap-6">
          <div className="group relative" ref={profileRef}>
            {loggedInEmpleadoId ? (
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
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors duration-200 cursor-pointer"
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
        </div>
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
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "hover:bg-gray-50"
                }`
              }
            >
              PANEL DE ADMINISTRACION
            </NavLink>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            {loggedInEmpleadoId ? (
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

export default  NavbarAdmin;