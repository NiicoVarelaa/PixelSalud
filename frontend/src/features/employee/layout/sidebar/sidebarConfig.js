import {
  Home,
  ShoppingCart,
  Package,
  User,
  BarChart2,
} from "lucide-react";

export const baseMenuItems = [
  {
    label: "Dashboard",
    icon: Home,
    path: "/panelempleados",
    ariaLabel: "Ir al panel principal",
    requires: null,
  },
  {
    label: "Realizar Venta",
    icon: ShoppingCart,
    path: "/panelempleados/venta",
    ariaLabel: "Registrar nueva venta",
    requires: null,
  },
  {
    label: "Productos",
    icon: Package,
    path: "/panelempleados/productos",
    ariaLabel: "Consultar productos",
    requires: null,
  },
  {
    label: "Mis Ventas",
    icon: User,
    path: "/panelempleados/misventas",
    ariaLabel: "Ver historial de ventas personales",
    requires: null,
  },
  {
    label: "Ventas Totales",
    icon: BarChart2,
    path: "/panelempleados/ventastotales",
    ariaLabel: "Ver todas las ventas de la farmacia",
    requires: "ver_ventasTotalesE",
  },
];
