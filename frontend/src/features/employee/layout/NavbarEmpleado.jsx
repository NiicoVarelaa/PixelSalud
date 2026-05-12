import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import LogoPixelSalud from "@assets/LogoPixelSalud.webp";
import closeIcon from "@assets/iconos/cross_icon.png";
import { Menu } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenuContent from "./MobileMenuContent";
import MobileMenuFooter from "./MobileMenuFooter";

const NavbarEmpleado = () => {
  const { user } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);

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

  const isAuthorized = !!user;

  return (
    <div className="py-5 font-medium relative bg-secondary-100 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="flex items-center justify-between w-full mx-auto">
        <Link to={user?.rol === "medico" ? "/panelmedico" : "/panelempleados"}>
          <img className="w-auto h-9" src={LogoPixelSalud} alt="Logo Pixel Salud" />
        </Link>

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

        {user?.rol === "medico" && (
          <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
            <NavLink
              to="/panelmedico"
              className="flex flex-col items-center gap-1 transition transform hover:scale-105 hover:text-green-500 duration-300"
            >
              <p>PANEL MÉDICO</p>
            </NavLink>
          </ul>
        )}

        <div className="flex items-center gap-6">
          <div ref={profileRef}>
            <ProfileDropdown
              isOpen={isProfileDropdownOpen}
              onClose={setIsProfileDropdownOpen}
            />
          </div>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="sm:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

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
            <img className="w-auto h-9" src={LogoPixelSalud} alt="Logo Pixel Salud" />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-full cursor-pointer"
              aria-label="Cerrar menú"
            >
              <img src={closeIcon} className="w-5" alt="Cerrar menú" />
            </button>
          </div>

          <MobileMenuContent
            user={user}
            onNavigate={() => setIsMenuOpen(false)}
          />

          <MobileMenuFooter
            isAuthorized={isAuthorized}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default NavbarEmpleado;
