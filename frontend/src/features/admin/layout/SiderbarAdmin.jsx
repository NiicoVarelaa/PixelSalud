import {
  Home,
  Package,
  Users,
  Briefcase,
  BarChart2,
  FileSpreadsheet,
  Tag,
  MessageSquare,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const SidebarAdmin = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const isActive = (path) => {
    // Comparación exacta para evitar que Dashboard esté activo en todas las rutas
    return location.pathname === path;
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/admin",
      badge: null,
    },
    {
      label: "Productos",
      icon: Package,
      path: "/admin/MenuProductos",
      badge: null,
    },
    {
      label: "Clientes",
      icon: Users,
      path: "/admin/MenuClientes",
      badge: null,
    },
    {
      label: "Empleados",
      icon: Briefcase,
      path: "/admin/MenuEmpleados",
      badge: null,
    },
    {
      label: "Ventas",
      icon: BarChart2,
      path: "/admin/MenuVentas",
      badge: null,
    },
    {
      label: "Reportes",
      icon: FileSpreadsheet,
      path: "/admin/reportes",
      badge: null,
    },
    {
      label: "Cupones",
      icon: Tag,
      path: "/admin/cupones",
      badge: null,
    },
    {
      label: "Mensajes",
      icon: MessageSquare,
      path: "/admin/mensajes",
      badge: null,
    },
    {
      label: "Auditoría",
      icon: Shield,
      path: "/admin/auditoria",
      badge: null,
    },
  ];

  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <button
        onClick={() => navigate(item.path)}
        className={`
          group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
          transition-all duration-200 font-medium text-sm
          ${
            active
              ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
      >
        {/* Indicador lateral para item activo */}
        {active && (
          <div className="absolute left-0 w-1 h-8 bg-primary-700 rounded-r-full -ml-3"></div>
        )}

        <Icon
          size={20}
          className={
            active ? "text-white" : "text-gray-500 group-hover:text-gray-700"
          }
        />
        <span className="flex-1 text-left">{item.label}</span>

        {/* Badge de notificaciones */}
        {item.badge && (
          <span
            className={`
            ${item.badge.color} text-white text-xs font-bold 
            px-2 py-0.5 rounded-full min-w-[20px] text-center
          `}
          >
            {item.badge.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm">
      {/* HEADER con stats del usuario */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 
                          flex items-center justify-center text-white font-bold text-lg shadow-lg"
            >
              {user?.nombre?.charAt(0)}
              {user?.apellido?.charAt(0)}
            </div>
            {/* Indicador online */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {user?.nombre} {user?.apellido}
            </h3>
            <p className="text-xs text-gray-500 font-medium capitalize">
              {user?.rol}
            </p>
          </div>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => (
          <MenuItem key={item.path} item={item} />
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-medium">
            PixelSalud Admin v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
