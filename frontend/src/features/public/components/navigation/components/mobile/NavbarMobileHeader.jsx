import { Link } from "react-router-dom";
import { X } from "lucide-react";
import LogoPixelSalud from "@assets/LogoPixelSalud.webp";

const NavbarMobileHeader = ({ onCloseMenu, closeButtonRef }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200">
    <Link to="/" onClick={onCloseMenu} aria-label="Ir a inicio">
      <img src={LogoPixelSalud} alt="Pixel Salud" className="w-32 h-auto" />
    </Link>
    <button
      ref={closeButtonRef}
      onClick={onCloseMenu}
      className="p-2 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      aria-label="Cerrar menú"
    >
      <X className="w-6 h-6" aria-hidden="true" />
    </button>
  </div>
);

export default NavbarMobileHeader;
