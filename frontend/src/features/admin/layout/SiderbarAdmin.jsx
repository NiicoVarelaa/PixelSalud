import {
  Home,
  Package,
  Users,
  Briefcase,
  BarChart2,
  FileSpreadsheet,
  BadgePercent,
  Megaphone,
  Ticket,
  MessageSquare,
  Shield,
  X,
  Menu,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const SidebarAdmin = () => {
  const { user, logoutUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Close sidebar when clicking outside on mobile
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

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Focus management for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isMobileMenuOpen]);

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = useAuthStore.getState().token;
        const response = await axios.get(`${backendUrl}/mensajes/no-leidos`, {
          headers: { Auth: `Bearer ${token}` },
        });
        setUnreadMessagesCount(response.data.count || 0);
      } catch (error) {
        console.error("Error al obtener mensajes no leídos:", error);
      }
    };

    if (user) {
      fetchUnreadMessages();
      const interval = setInterval(fetchUnreadMessages, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/admin",
      badge: null,
      ariaLabel: "Ir al panel principal de administración",
    },
    {
      label: "Productos",
      icon: Package,
      path: "/admin/MenuProductos",
      badge: null,
      ariaLabel: "Gestionar productos del inventario",
    },
    {
      label: "Ofertas",
      icon: BadgePercent,
      path: "/admin/ofertas",
      badge: null,
      ariaLabel: "Gestionar ofertas individuales de productos",
    },
    {
      label: "Campañas",
      icon: Megaphone,
      path: "/admin/MenuProductos/campanas",
      badge: null,
      ariaLabel: "Gestionar campañas y promociones",
    },
    {
      label: "Clientes",
      icon: Users,
      path: "/admin/MenuClientes",
      badge: null,
      ariaLabel: "Administrar clientes registrados",
    },
    {
      label: "Empleados",
      icon: Briefcase,
      path: "/admin/MenuEmpleados",
      badge: null,
      ariaLabel: "Gestionar empleados y permisos",
    },
    {
      label: "Ventas",
      icon: BarChart2,
      path: "/admin/MenuVentas",
      badge: null,
      ariaLabel: "Ver historial de ventas",
    },
    {
      label: "Reportes",
      icon: FileSpreadsheet,
      path: "/admin/reportes",
      badge: null,
      ariaLabel: "Generar reportes y estadísticas",
    },
    {
      label: "Cupones",
      icon: Ticket,
      path: "/admin/cupones",
      badge: null,
      ariaLabel: "Administrar cupones de descuento",
    },
    {
      label: "Mensajes",
      icon: MessageSquare,
      path: "/admin/mensajes",
      badge: null,
      ariaLabel: "Ver mensajes",
    },
    {
      label: "Auditoría",
      icon: Shield,
      path: "/admin/auditoria",
      badge: null,
      ariaLabel: "Revisar logs de auditoría del sistema",
    },
  ];

  // Agregar badge dinámico a Mensajes
  const menuItemsWithBadges = menuItems.map((item) => {
    if (item.path === "/admin/mensajes") {
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
    }
    return item;
  });

  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <button
        onClick={() => navigate(item.path)}
        className={`
          group flex items-center w-full px-4 py-3 cursor-pointer rounded-r-lg
          text-base font-medium transition-colors duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700
          border-l-4
          ${
            active
              ? "bg-green-50 border-green-600 text-green-700 shadow-sm"
              : "bg-white border-transparent text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg"
          }
        `}
        aria-label={item.ariaLabel}
        aria-current={active ? "page" : undefined}
        style={{ minHeight: 48 }}
      >
        <Icon
          size={22}
          className={`mr-3 transition-colors duration-200 ${active ? "text-green-700" : "text-gray-600 group-hover:text-green-700"}`}
          aria-hidden="true"
        />
        <span className="flex-1 text-left truncate">{item.label}</span>
        {item.badge && (
          <span
            className="ml-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center shadow-sm"
            role="status"
            aria-label={`${item.badge.count} notificaciones`}
          >
            {item.badge.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Navbar - Sticky Top */}
      <nav
        className="lg:hidden sticky top-0 z-50 bg-gradient-to-r from-white via-green-50/30 to-white 
                   border-b-2 border-gray-200 shadow-md backdrop-blur-sm"
        aria-label="Barra de navegación móvil"
      >
        <div className="flex items-center justify-between px-4 h-16">
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 rounded-xl text-gray-700 hover:bg-green-100 hover:text-green-700
                       active:scale-95 focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-green-500 transition-all touch-manipulation
                       shadow-sm hover:shadow-md"
            aria-label="Abrir menú de navegación"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>

          {/* Brand/Title */}
          <div className="flex-1 flex justify-center items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-green-700 
                            flex items-center justify-center shadow-sm"
            >
              <span className="text-white font-bold text-sm">PS</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Pixel Salud
            </h1>
          </div>

          {/* Spacer for symmetry */}
          <div className="w-11"></div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-white border-r border-gray-200 
          flex flex-col shadow-xl lg:shadow-sm
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        aria-label="Menú de navegación principal"
      >
        {/* Close button (mobile only) */}
        <button
          ref={closeButtonRef}
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-700 
                      cursor-pointer active:scale-95 focus-visible:outline-none 
                     focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-1 
                     transition-all min-h-11 min-w-11 touch-manipulation"
          aria-label="Cerrar menú de navegación"
        >
          <X size={22} />
        </button>

        {/* Header with user info */}
        <div className="p-5 border-b border-gray-100 bg-linear-to-br from-green-50 to-white">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-12 h-12 rounded-lg bg-primary-700 
                          flex items-center justify-center text-white font-bold text-xl shadow-lg"
                aria-hidden="true"
              >
                {user?.nombre?.charAt(0)}
                {user?.apellido?.charAt(0)}
              </div>
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">
                {user?.nombre} {user?.apellido}
              </h2>
              <p className="text-xs text-gray-600 font-medium capitalize">
                {user?.rol || "Administrador"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          aria-label="Menú principal"
        >
          {menuItemsWithBadges.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50">
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 
                       bg-red-50 border border-red-200 rounded-xl text-red-700 
                       hover:bg-red-100 hover:border-red-300 active:scale-95
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-1
                       transition-all text-sm font-medium min-h-11 touch-manipulation cursor-pointer"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarAdmin;
