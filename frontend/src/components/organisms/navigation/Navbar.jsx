import { useState, useEffect, useRef } from "react";
import { useCarritoStore } from "@store/useCarritoStore";
import { useAuthStore } from "@store/useAuthStore";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  CircleUserRound,
  Heart,
  Search,
  ChevronDown,
} from "lucide-react";

import {
  NavbarAvatar,
  NavbarMenuUsuario,
  NavbarMenuCelular,
} from "@components/molecules/navigation";
import { SearchSuggestions } from "@components/molecules/search";
import { MiniBanner } from "@components/organisms/banners";
import { CATEGORIAS_DATA } from "@data/categoriasData";
import apiClient from "@utils/apiClient";

import LogoPixelSalud from "@assets/LogoPixelSalud.webp";

const Navbar = () => {
  const { carrito, sincronizarCarrito } = useCarritoStore();
  const { user, logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const totalItems = (carrito || []).reduce(
    (acc, item) => acc + (item.cantidad || 0),
    0,
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriasOpen, setIsCategoriasOpen] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const categoriasRef = useRef(null);
  const searchDesktopRef = useRef(null);
  const searchMobileRef = useRef(null);

  useEffect(() => {
    sincronizarCarrito();
  }, [user, sincronizarCarrito]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (
        categoriasRef.current &&
        !categoriasRef.current.contains(event.target)
      ) {
        setIsCategoriasOpen(false);
      }
      if (
        searchDesktopRef.current &&
        !searchDesktopRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
      // No cerrar sugerencias mobile con click outside, solo con ESC o botón X
      // if (
      //   searchMobileRef.current &&
      //   !searchMobileRef.current.contains(event.target)
      // ) {
      //   setShowSuggestions(false);
      // }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsProfileDropdownOpen(false);
        setIsSearchOpen(false);
        setIsCategoriasOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

  // Efecto para buscar productos con debounce
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
      setSuggestedProducts([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    setShowSuggestions(true);

    const timer = setTimeout(async () => {
      try {
        const response = await apiClient.get("/productos/buscar", {
          params: { term: searchTerm },
        });
        if (Array.isArray(response.data)) {
          setSuggestedProducts(response.data);
        }
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setSuggestedProducts([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleLogout = () => {
    logoutUser();
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?busqueda=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsSearchOpen(false);
      setShowSuggestions(false);
      setSuggestedProducts([]);
    }
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
  };

  const handleCloseMobileSearch = () => {
    setShowSuggestions(false);
    setSearchTerm("");
    setSuggestedProducts([]);
    setIsSearchOpen(false);
  };

  const navLinks = [
    { to: "/productos", label: "TIENDA" },
    { to: "/sobreNosotros", label: "NOSOTROS" },
    { to: "/contacto", label: "CONTACTO" },
  ];

  const handleCategoriaClick = (categoria) => {
    navigate(`/productos?categoria=${encodeURIComponent(categoria)}`);
    setIsCategoriasOpen(false);
  };

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
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            {/* Primera fila: Logo + Buscador + Íconos */}
            <div className="flex items-center justify-between gap-4 py-4 font-medium relative">
              {/* Logo */}
              <Link to="/" className="shrink-0">
                <img
                  className="w-auto h-8"
                  src={LogoPixelSalud}
                  alt="Logo Pixel Salud"
                />
              </Link>

              {/* Buscador - Desktop (Centro) */}
              <form
                onSubmit={handleSearch}
                className="hidden md:flex flex-1 max-w-2xl mx-4"
              >
                <div className="relative w-full" ref={searchDesktopRef}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() =>
                      searchTerm.length >= 3 && setShowSuggestions(true)
                    }
                    placeholder="Buscá por producto, marca o categoría..."
                    className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
                    aria-label="Buscar"
                  >
                    <Search className="w-5 h-5 text-gray-500" />
                  </button>

                  {/* Sugerencias Desktop */}
                  {showSuggestions && (
                    <SearchSuggestions
                      searchTerm={searchTerm}
                      productos={suggestedProducts}
                      onClose={handleCloseSuggestions}
                      isLoading={isLoadingSuggestions}
                    />
                  )}
                </div>
              </form>

              {/* Action Icons */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Ícono de búsqueda - Solo Mobile */}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="md:hidden p-2 flex items-center justify-center"
                  aria-label="Buscar productos"
                >
                  <Search
                    strokeWidth={1.5}
                    className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700"
                  />
                </button>

                {user && (
                  <Link
                    to="/perfil/favoritos"
                    className="relative p-2 flex items-center justify-center"
                    aria-label="Ver mis productos favoritos"
                  >
                    <Heart
                      strokeWidth={1.5}
                      fill="none"
                      className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 hover:text-red-500 hover:fill-red-500 transition-colors duration-100"
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
                      className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700"
                    />
                  </Link>
                )}

                <div className="group relative" ref={profileRef}>
                  {user ? (
                    <>
                      <button
                        onClick={() =>
                          setIsProfileDropdownOpen(!isProfileDropdownOpen)
                        }
                        className="flex items-center gap-2 p-2 transition-colors duration-200 cursor-pointer"
                        aria-label="Abrir menú de perfil"
                      >
                        <NavbarAvatar user={user} size="tiny" />
                        <span className="hidden xl:block text-sm text-gray-700 hover:text-primary-700 font-semibold transition-colors duration-200">
                          ¡Hola{" "}
                          {user.nombre
                            ? capitalizeName(user.nombre.split(" ")[0])
                            : "Mi cuenta"}
                          !
                        </span>
                      </button>
                      {isProfileDropdownOpen && (
                        <NavbarMenuUsuario
                          user={user}
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
                        className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700"
                      />
                      <span className="hidden xl:block text-sm text-gray-700">
                        Ingresar
                      </span>
                    </NavLink>
                  )}
                </div>

                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="w-8 h-8 flex items-center justify-center cursor-pointer lg:hidden"
                  aria-label="Abrir menú"
                >
                  <Menu
                    strokeWidth={1.5}
                    className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700"
                  />
                </button>
              </div>
            </div>

            {/* Segunda fila: Nav Links (Desktop) */}
            <nav className="hidden lg:block">
              <ul className="flex items-center justify-center gap-8 py-3 text-sm text-gray-700">
                {/* Dropdown de Categorías */}
                <li className="relative" ref={categoriasRef}>
                  <button
                    onClick={() => setIsCategoriasOpen(!isCategoriasOpen)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer align-middle ${
                      isCategoriasOpen
                        ? "bg-primary-50 text-primary-700"
                        : "hover:text-primary-700"
                    }`}
                  >
                    <span className="font-medium">CATEGORÍAS</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isCategoriasOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isCategoriasOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 max-h-128 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {CATEGORIAS_DATA.map((categoria, index) => (
                        <div key={categoria.text}>
                          <button
                            onClick={() => handleCategoriaClick(categoria.link)}
                            className="w-full text-left px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group cursor-pointer"
                          >
                            <span className="text-sm font-medium">
                              {categoria.text}
                            </span>
                            <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400 group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all" />
                          </button>

                          {/* Separador */}
                          {index < CATEGORIAS_DATA.length - 1 && (
                            <div className="mx-3 my-1 border-t border-gray-100" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </li>

                {/* Otros Links */}
                {navLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className="cursor-pointer flex items-center px-3 py-1.5 rounded-lg font-medium align-middle transition-all duration-200 hover:text-primary-700"
                  >
                    {({ isActive }) => (
                      <span className={isActive ? "text-primary-700" : ""}>
                        {label}
                      </span>
                    )}
                  </NavLink>
                ))}
              </ul>
            </nav>

            {/* Buscador - Mobile (Expandible) */}
            {isSearchOpen && (
              <div className="md:hidden border-t border-gray-100 py-3 animate-in slide-in-from-top-2 duration-200">
                <form onSubmit={handleSearch}>
                  <div className="relative w-full" ref={searchMobileRef}>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() =>
                        searchTerm.length >= 3 && setShowSuggestions(true)
                      }
                      placeholder="Buscá por producto, marca o categoría..."
                      className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleCloseMobileSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
                      aria-label="Cerrar búsqueda"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    {/* Sugerencias Mobile */}
                    {showSuggestions && (
                      <SearchSuggestions
                        searchTerm={searchTerm}
                        productos={suggestedProducts}
                        onClose={handleCloseSuggestions}
                        isLoading={isLoadingSuggestions}
                      />
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Spacer para compensar navbar fijo */}
      <div className="h-[98px] md:h-[98px] lg:h-[130px]"></div>
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
