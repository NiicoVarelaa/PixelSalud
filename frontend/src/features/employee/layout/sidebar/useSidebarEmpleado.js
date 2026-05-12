import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import { baseMenuItems } from "./sidebarConfig";

const useSidebarEmpleado = () => {
  const { user, logoutUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null);

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname],
  );

  const handleLogout = useCallback(() => {
    logoutUser();
    navigate("/login");
  }, [logoutUser, navigate]);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
      setIsMobileMenuOpen(false);
    },
    [navigate],
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isMobileMenuOpen]);

  const menuItems = useMemo(
    () => {
      const permisos = user?.permisos || {};
      return baseMenuItems.filter((item) => {
        if (!item.requires) return true;
        return permisos[item.requires] === 1 || permisos[item.requires] === true;
      });
    },
    [user?.permisos],
  );

  return {
    isMobileMenuOpen,
    closeButtonRef,
    menuItems,
    sidebarRef,
    user,
    isActive,
    handleLogout,
    handleNavigate,
    setIsMobileMenuOpen,
  };
};

export default useSidebarEmpleado;
