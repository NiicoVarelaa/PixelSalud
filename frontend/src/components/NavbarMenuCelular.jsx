import { Link, NavLink } from "react-router-dom";
import { X, ShoppingBag, ShoppingCart, User, LogOut, Truck } from "lucide-react";
import NavbarAvatar from "./NavbarAvatar";
import LogoPixelSalud from "../assets/LogoPixelSalud.webp";

const capitalizeName = (name) =>
  name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const NavbarMenuCelular = ({
  isMenuOpen,
  setIsMenuOpen,
  menuRef,
  navLinks,
  cliente,
  handleLogout,
  totalItems = 0, // Valor por defecto
}) => {
  const nombreClienteCapitalizado = cliente?.nombreCliente ? capitalizeName(cliente.nombreCliente) : "Usuario";

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div
        ref={menuRef}
        className={`absolute top-0 right-0 h-full w-full max-w-xs bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img
              className="w-auto h-7"
              src={LogoPixelSalud}
              alt="Logo Pixel Salud"
            />
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full cursor-pointer text-gray-600 hover:text-gray-900"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {cliente && (
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <NavbarAvatar cliente={cliente} size="medium" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {nombreClienteCapitalizado} 
                </p>
                <p className="text-xs text-gray-600">{cliente.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex flex-col flex-grow p-4  overflow-y-auto my-4">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setIsMenuOpen(false)}>
              {({ isActive }) => (
                <div className="flex flex-col gap-1 transition-colors duration-200 mb-3 px-1">
                  <p
                    className={
                      isActive ? "text-primary-700 font-medium" : "hover:text-primary-700 text-gray-700 font-medium"
                    }
                  >
                    {label}
                  </p>
                </div>
              )}
            </NavLink>
          ))}

          <hr className="my-4 border-t border-gray-200" />

          {cliente ? (
            <>
              <NavLink
                to="/perfil"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-1 rounded-lg text-base font-medium text-gray-700 hover:text-primary-700 transition-colors duration-200"
              >
                <User className="w-5 h-5" />
                Mi Perfil
              </NavLink>
              
              <Link
                to="/mis-compras"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-1 rounded-lg text-base font-medium text-gray-700 hover:text-primary-700 transition-colors duration-200"
              >
                <ShoppingBag className="w-5 h-5" />
                Mis Compras
              </Link>

              <Link
                to="/mis-pedidos"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-1 rounded-lg text-base font-medium text-gray-700 hover:text-primary-700 transition-colors duration-200"
              >
                <Truck className="w-5 h-5" />
                Mis Pedidos
              </Link>

              <hr className="my-4 border-t border-gray-200" /> 
              
              <Link
                to="/carrito"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-3 px-1 rounded-lg text-base font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors duration-200 mb-2" 
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  Ver Carrito
                </span>
                <span className="bg-primary-700 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {totalItems} items
                </span>
              </Link>

              <hr className="my-4 border-t border-gray-200" /> 

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-3 px-1 rounded-lg text-base font-medium w-full text-red-600 hover:text-red-700 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 py-3 px-1 rounded-lg text-base font-medium text-gray-700 hover:text-primary-700 transition-colors duration-200"
            >
              <User className="w-5 h-5" />
              Ingresar
            </NavLink>
          )}
        </nav>
      </div>
    </div>
  );
};

export default NavbarMenuCelular;