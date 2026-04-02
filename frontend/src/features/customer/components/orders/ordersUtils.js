import { CheckCircle2, Clock, Package, XCircle } from "lucide-react";

export const ARS_FORMATTER = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

export const resolveProductImage = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return null;

  if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith("data:")) {
    return imagePath;
  }

  const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const apiOrigin = rawApiUrl.replace(/\/?api\/?$/i, "").replace(/\/$/, "");
  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  return `${apiOrigin}${normalizedPath}`;
};

export const agruparVentas = (datos = []) => {
  const ventas = {};

  datos.forEach((fila) => {
    const {
      idVentaO,
      fechaPago,
      horaPago,
      metodoPago,
      totalPago,
      estado,
      nombreProducto,
      cantidad,
      precioUnitario,
      img,
    } = fila;

    if (!ventas[idVentaO]) {
      ventas[idVentaO] = {
        idVentaO,
        fechaPago,
        horaPago,
        metodoPago,
        totalPago: Number(totalPago),
        estado,
        productos: [],
      };
    }

    ventas[idVentaO].productos.push({
      nombreProducto,
      cantidad: Number(cantidad),
      precioUnitario: Number(precioUnitario),
      img,
    });
  });

  return Object.values(ventas).sort((a, b) => b.idVentaO - a.idVentaO);
};

export const getStatusConfig = (estado) => {
  switch (estado?.toLowerCase()) {
    case "pendiente":
      return {
        icon: Clock,
        className: "text-amber-700 bg-amber-50 border-amber-200",
        label: "Pendiente",
      };
    case "retirado":
    case "entregado":
      return {
        icon: CheckCircle2,
        className: "text-emerald-700 bg-emerald-50 border-emerald-200",
        label: "Completado",
      };
    case "cancelado":
      return {
        icon: XCircle,
        className: "text-rose-700 bg-rose-50 border-rose-200",
        label: "Cancelado",
      };
    default:
      return {
        icon: Package,
        className: "text-slate-700 bg-slate-50 border-slate-200",
        label: estado,
      };
  }
};
