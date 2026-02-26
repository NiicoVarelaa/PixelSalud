import { useEffect } from "react";

export function useNavbarGlobalEvents({
  menuRef,
  profileRef,
  categoriasRef,
  searchDesktopRef,
  setIsMenuOpen,
  setIsProfileDropdownOpen,
  setIsCategoriasOpen,
  setShowSuggestions,
  setIsSearchOpen,
}) {
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
  }, [
    menuRef,
    profileRef,
    categoriasRef,
    searchDesktopRef,
    setIsMenuOpen,
    setIsProfileDropdownOpen,
    setIsCategoriasOpen,
    setShowSuggestions,
    setIsSearchOpen,
  ]);
}
