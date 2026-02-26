import { NavbarSearchMobile } from "./NavbarSearchMobile";
import { NavbarSearchDesktop } from "./NavbarSearchDesktop";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarOffersLink } from "./NavbarOffersLink";
import { NavbarCategoriesDropdown } from "./NavbarCategoriesDropdown";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavbarGlobalEvents } from "@hooks/useNavbarGlobalEvents";
import { useCarritoStore } from "@store/useCarritoStore";
import { useAuthStore } from "@store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import {
  NavbarMenuCelular,
} from "@components/molecules/navigation";
import { MiniBanner } from "@components/organisms/banners";
import apiClient from "@utils/apiClient";
import LogoPixelSalud from "@assets/LogoPixelSalud.webp";
import { ActionIcons } from "./ActionIcons";

const Navbar = () => {
  const { carrito, sincronizarCarrito } = useCarritoStore();
  const { user, logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const totalItems = useMemo(
    () => (carrito || []).reduce((acc, item) => acc + (item.cantidad || 0), 0),
    [carrito],
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

  useNavbarGlobalEvents({
    menuRef,
    profileRef,
    categoriasRef,
    searchDesktopRef,
    setIsMenuOpen,
    setIsProfileDropdownOpen,
    setIsCategoriasOpen,
    setShowSuggestions,
    setIsSearchOpen,
  });

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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${showBanner ? "translate-y-0" : "-translate-y-10 shadow-md"}`}
        aria-label="Main navigation"
      >
        <MiniBanner />
        <div className="bg-white">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            {/* Primera fila: Logo + Buscador + Íconos */}
            <div className="flex items-center justify-between gap-4 py-4 font-medium relative">
              {/* Logo */}
              <Link
                to="/"
                className="shrink-0"
                tabIndex={0}
                aria-label="Ir a inicio"
              >
                <img
                  className="w-auto h-8"
                  src={LogoPixelSalud}
                  alt="Logo Pixel Salud"
                />
              </Link>

              {/* Buscador - Desktop (Centro) */}
              <NavbarSearchDesktop
                handleSearch={handleSearch}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setShowSuggestions={setShowSuggestions}
                showSuggestions={showSuggestions}
                suggestedProducts={suggestedProducts}
                handleCloseSuggestions={handleCloseSuggestions}
                isLoadingSuggestions={isLoadingSuggestions}
                searchDesktopRef={searchDesktopRef}
              />

              {/* Action Icons */}
              <ActionIcons
                user={user}
                handleLogout={handleLogout}
                setIsSearchOpen={setIsSearchOpen}
                setIsMenuOpen={setIsMenuOpen}
                profileRef={profileRef}
                isProfileDropdownOpen={isProfileDropdownOpen}
                setIsProfileDropdownOpen={setIsProfileDropdownOpen}
                totalItems={totalItems}
                navLinks={navLinks}
                menuRef={menuRef}
              />
            </div>

            {/* Segunda fila: Nav Links (Desktop) */}
            <nav className="hidden lg:block" aria-label="Enlaces principales">
              <ul className="flex items-center justify-center gap-8 py-3 text-sm text-gray-700">
                {/* Dropdown de Categorías */}
                <NavbarCategoriesDropdown
                  isCategoriasOpen={isCategoriasOpen}
                  setIsCategoriasOpen={setIsCategoriasOpen}
                  categoriasRef={categoriasRef}
                  handleCategoriaClick={handleCategoriaClick}
                />

                {/* Link de Ofertas */}
                <NavbarOffersLink />

                {/* Otros Links */}
                <NavbarLinks navLinks={navLinks} />
              </ul>
            </nav>

            {/* Buscador - Mobile (Expandible) */}
            <NavbarSearchMobile
              isSearchOpen={isSearchOpen}
              handleSearch={handleSearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setShowSuggestions={setShowSuggestions}
              showSuggestions={showSuggestions}
              suggestedProducts={suggestedProducts}
              handleCloseSuggestions={handleCloseSuggestions}
              isLoadingSuggestions={isLoadingSuggestions}
              searchMobileRef={searchMobileRef}
              handleCloseMobileSearch={handleCloseMobileSearch}
            />
          </div>
        </div>
      </nav>
      {/* Spacer para compensar navbar fijo */}
      <div
        className="h-[98px] md:h-[98px] lg:h-[130px]"
        aria-hidden="true"
      ></div>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
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
