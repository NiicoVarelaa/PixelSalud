import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import apiClient from "@utils/apiClient";
import { useModalLock } from "@hooks/useModalLock";
import { baseMenuItems } from "./sidebarConfig";

const useSidebarAdmin = () => {
  const { user, logoutUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

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
    },
    [navigate],
  );

  const fetchUnreadMessages = useCallback(async () => {
    if (!user) return;

    try {
      const { data } = await apiClient.get("/mensajes/no-leidos");
      setUnreadMessagesCount(data.count || 0);
    } catch {
      console.error("Error al obtener mensajes no leídos");
    }
  }, [user]);

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

  useModalLock(isMobileMenuOpen);

  useEffect(() => {
    if (isMobileMenuOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!user) return undefined;

    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadMessages, user]);

  const menuItems = useMemo(
    () =>
      baseMenuItems.map((item) => {
        if (item.path !== "/admin/mensajes") return item;

        return {
          ...item,
          badge:
            unreadMessagesCount > 0
              ? { count: unreadMessagesCount, color: "bg-orange-500" }
              : null,
          ariaLabel:
            unreadMessagesCount > 0
              ? `Ver mensajes, ${unreadMessagesCount} sin leer`
              : "Ver mensajes",
        };
      }),
    [unreadMessagesCount],
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

export default useSidebarAdmin;
