import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const getFocusableElements = (container) => {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
};

const useNavbarMobileMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  handleLogout,
  setIsCartModalOpen,
  menuRef,
}) => {
  const navigate = useNavigate();
  const [isCategoriasOpen, setIsCategoriasOpen] = useState(false);
  const categoriasRef = useRef(null);
  const closeButtonRef = useRef(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  const handleCategoriaClick = useCallback(
    (categoria) => {
      navigate(`/productos?categoria=${encodeURIComponent(categoria)}`);
      setIsCategoriasOpen(false);
      closeMenu();
    },
    [closeMenu, navigate],
  );

  const handleCartOpen = useCallback(() => {
    setIsCartModalOpen(true);
    closeMenu();
  }, [closeMenu, setIsCartModalOpen]);

  const handleLogoutClick = useCallback(() => {
    handleLogout();
    closeMenu();
  }, [closeMenu, handleLogout]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeMenu, isMenuOpen]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== "Tab") {
        return;
      }

      const focusables = getFocusableElements(menuRef.current);
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    },
    [menuRef],
  );

  return {
    categoriasRef,
    closeButtonRef,
    isCategoriasOpen,
    closeMenu,
    handleCategoriaClick,
    handleCartOpen,
    handleKeyDown,
    handleLogoutClick,
    setIsCategoriasOpen,
  };
};

export default useNavbarMobileMenu;
