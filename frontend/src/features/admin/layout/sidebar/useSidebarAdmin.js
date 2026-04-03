import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import { baseMenuItems } from "./sidebarConfig";

const useSidebarAdmin = () => {
  const { user, token, logoutUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null);

  const backendUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    if (!token) return;

    try {
      const response = await axios.get(`${backendUrl}/mensajes/no-leidos`, {
        headers: { auth: `Bearer ${token}` },
      });
      setUnreadMessagesCount(response.data.count || 0);
    } catch (error) {
      console.error("Error al obtener mensajes no leídos:", error);
    }
  }, [backendUrl, token]);

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
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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
    user,
    menuItems,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isActive,
    handleLogout,
    handleNavigate,
    sidebarRef,
    closeButtonRef,
  };
};

export default useSidebarAdmin;
