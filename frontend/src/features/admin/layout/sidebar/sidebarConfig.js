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
} from "lucide-react";

export const baseMenuItems = [
  {
    label: "Dashboard",
    icon: Home,
    path: "/admin",
    ariaLabel: "Ir al panel principal de administración",
  },
  {
    label: "Ventas",
    icon: BarChart2,
    path: "/admin/MenuVentas",
    ariaLabel: "Ver historial de ventas",
  },
  {
    label: "Reportes",
    icon: FileSpreadsheet,
    path: "/admin/reportes",
    ariaLabel: "Generar reportes y estadísticas",
  },
  {
    label: "Productos",
    icon: Package,
    path: "/admin/productos",
    ariaLabel: "Gestionar productos del inventario",
  },
  {
    label: "Ofertas",
    icon: BadgePercent,
    path: "/admin/ofertas",
    ariaLabel: "Gestionar ofertas individuales de productos",
  },
  {
    label: "Campañas",
    icon: Megaphone,
    path: "/admin/campanas",
    ariaLabel: "Gestionar campañas y promociones",
  },
  {
    label: "Clientes",
    icon: Users,
    path: "/admin/MenuClientes",
    ariaLabel: "Administrar clientes registrados",
  },
  {
    label: "Empleados",
    icon: Briefcase,
    path: "/admin/MenuEmpleados",
    ariaLabel: "Gestionar empleados y permisos",
  },
  {
    label: "Cupones",
    icon: Ticket,
    path: "/admin/cupones",
    ariaLabel: "Administrar cupones de descuento",
  },
  {
    label: "Auditoría",
    icon: Shield,
    path: "/admin/auditoria",
    ariaLabel: "Revisar logs de auditoría del sistema",
  },
  {
    label: "Mensajes",
    icon: MessageSquare,
    path: "/admin/mensajes",
    ariaLabel: "Ver mensajes",
  },
];
