import { useState, useEffect, useRef } from "react";
// 1. Importa el store del carrito y el NUEVO store de autenticación
import { useCarritoStore } from "../store/useCarritoStore";
import { useAuthStore } from "../store/useAuthStore"; // Se cambia el store
import { Link, NavLink, useNavigate } from "react-router-dom";

// Componentes (no cambian)
import NavbarAvatar from "./NavbarAvatar";
import NavbarMenuUsuario from "./NavbarMenuUsuario";
import NavbarMenuCelular from "./NavbarMenuCelular";
import MiniBanner from "./MiniBanner";

// Assets e Íconos (no cambian)
import LogoPixelSalud from "../assets/LogoPixelSalud.webp";
import { ShoppingCart, Menu, CircleUserRound, Heart } from "lucide-react";

const Navbar = () => {
  // 2. Obtiene los datos y acciones de los stores actualizados
  const { carrito, sincronizarCarrito } = useCarritoStore();
  const { user, logoutUser } = useAuthStore(); // Se usa 'user' y 'logoutUser'
  const navigate = useNavigate();

  const totalItems = (carrito || []).reduce(
    (acc, item) => acc + (item.cantidad || 0),
    0
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  // Sincroniza el carrito cuando el usuario cambia (login/logout)
  useEffect(() => {
    sincronizarCarrito();
  }, [user, sincronizarCarrito]); // La dependencia ahora es 'user'

  // 3. El useEffect para 'getCliente' se elimina. ¡Ya no es necesario!
  // Zustand se encarga de cargar el usuario desde localStorage automáticamente.
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
  }, []); // El array de dependencias ahora está vacío

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4. Se simplifica la función de logout
  const handleLogout = () => {
    logoutUser(); // Simplemente llama a la acción del store
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "INICIO" },
    { to: "/productos", label: "TIENDA" },
    { to: "/sobreNosotros", label: "NOSOTROS" },
    { to: "/contacto", label: "CONTACTO" },
  ];

  const capitalizeName = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          showBanner ? "translate-y-0" : "-translate-y-10 shadow-md"
        }`}
      >
        <MiniBanner />
        <div className="bg-white">
          <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <div className="flex items-center justify-between py-4 font-medium relative">
              <Link to="/">
                <img
                  className="w-auto h-8"
                  src={LogoPixelSalud}
                  alt="Logo Pixel Salud"
                />
              </Link>

              <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
                {navLinks.map(({ to, label }) => (
                  <NavLink key={to} to={to}>
                    {({ isActive }) => (
                      <div className="flex flex-col items-center gap-1 transition-colors duration-200">
                        <p
                          className={
                            isActive
                              ? "text-primary-700"
                              : "hover:text-primary-700"
                          }
                        >
                          {label}
                        </p>
                        <hr
                          className={`w-2/4 border-none h-[1.5px] bg-primary-700 transition-all duration-300 ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>
                    )}
                  </NavLink>
                ))}
              </ul>

              <div className="flex items-center gap-4">
                {/* 5. La lógica condicional ahora usa 'user' en lugar de 'cliente' */}
                {user && (
                  <Link
                    to="/perfil/favoritos"
                    className="relative p-2 flex items-center justify-center"
                    aria-label="Ver mis productos favoritos"
                  >
                    <Heart
                      strokeWidth={1.5}
                      fill="none"
                      className="w-7 h-7 text-gray-700 hover:text-red-500 hover:fill-red-500 transition-colors duration-100"
                    />
                  </Link>
                )}

                {user && (
                  <Link
                    to="/carrito"
                    className="relative p-2 flex items-center justify-center"
                  >
                    <ShoppingCart
                      strokeWidth={1.5}
                      className="w-7 h-7 text-gray-700"
                    />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary-700 text-white rounded-full text-xs font-medium">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}

                <div className="group relative" ref={profileRef}>
                  {user ? ( // Se verifica 'user'
                    <>
                      <button
                        onClick={() =>
                          setIsProfileDropdownOpen(!isProfileDropdownOpen)
                        }
                        className="flex items-center gap-2 p-2 transition-colors duration-200 cursor-pointer"
                        aria-label="Abrir menú de perfil"
                      >
                        <NavbarAvatar user={user} size="tiny" /> {/* Prop 'user' */}
                        <span className="hidden sm:block text-sm text-gray-700  hover:text-primary-700 font-semibold transition-colors duration-200">
                          ¡Hola{" "}
                          {user.nombre
                            ? capitalizeName(
                                user.nombre.split(" ")[0]
                              )
                            : "Mi cuenta"}
                          !
                        </span>
                      </button>
                      {isProfileDropdownOpen && (
                        <NavbarMenuUsuario
                          user={user} // Prop 'user'
                          handleLogout={handleLogout}
                          setIsProfileDropdownOpen={setIsProfileDropdownOpen}
                        />
                      )}
                    </>
                  ) : (
                    <NavLink
                      to="/login"
                      className="flex items-center gap-2 p-2"
                    >
                      <CircleUserRound
                        strokeWidth={1.5}
                        className="w-7 h-7 text-gray-700"
                      />
                      <span className="hidden sm:block text-sm text-gray-700">
                        Ingresar
                      </span>
                    </NavLink>
                  )}
                </div>

                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="w-8 h-8 flex items-center justify-center cursor-pointer sm:hidden"
                  aria-label="Abrir menú"
                >
                  <Menu strokeWidth={1.5} className="w-7 h-7 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[98px]"></div>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <NavbarMenuCelular
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            menuRef={menuRef}
            user={user}
            handleLogout={handleLogout}
            navLinks={navLinks}
            totalItems={totalItems}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;