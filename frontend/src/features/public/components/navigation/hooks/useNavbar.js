import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavbarGlobalEvents } from "@hooks/useNavbarGlobalEvents";
import { useCarritoStore } from "@store/useCarritoStore";
import { useAuthStore } from "@store/useAuthStore";
import apiClient from "@utils/apiClient";

const useNavbar = () => {
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
      setShowBanner(window.scrollY <= 50);
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
        setSuggestedProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setSuggestedProducts([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleLogout = useCallback(() => {
    logoutUser();
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  }, [logoutUser, navigate]);

  const handleSearch = useCallback(
    (event) => {
      event.preventDefault();
      const normalizedSearch = searchTerm.trim();

      if (!normalizedSearch) {
        return;
      }

      navigate(`/productos?busqueda=${encodeURIComponent(normalizedSearch)}`);
      setSearchTerm("");
      setIsSearchOpen(false);
      setShowSuggestions(false);
      setSuggestedProducts([]);
    },
    [navigate, searchTerm],
  );

  const handleCloseSuggestions = useCallback(() => {
    setShowSuggestions(false);
  }, []);

  const handleCloseMobileSearch = useCallback(() => {
    setShowSuggestions(false);
    setSearchTerm("");
    setSuggestedProducts([]);
    setIsSearchOpen(false);
  }, []);

  const handleCategoriaClick = useCallback(
    (categoria) => {
      navigate(`/productos?categoria=${encodeURIComponent(categoria)}`);
      setIsCategoriasOpen(false);
    },
    [navigate],
  );

  return {
    user,
    totalItems,
    isMenuOpen,
    isProfileDropdownOpen,
    showBanner,
    searchTerm,
    isSearchOpen,
    isCategoriasOpen,
    suggestedProducts,
    isLoadingSuggestions,
    showSuggestions,
    menuRef,
    profileRef,
    categoriasRef,
    searchDesktopRef,
    searchMobileRef,
    setSearchTerm,
    setShowSuggestions,
    setIsSearchOpen,
    setIsMenuOpen,
    setIsProfileDropdownOpen,
    setIsCategoriasOpen,
    handleLogout,
    handleSearch,
    handleCloseSuggestions,
    handleCloseMobileSearch,
    handleCategoriaClick,
  };
};

export default useNavbar;
