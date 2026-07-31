import { Banknote, CreditCard, ArrowRightLeft } from "lucide-react";
export { formatMoneda } from "@utils/formatMoneda";

export const formatearFecha = (fecha) => {
  if (!fecha) return "-";
  const d = new Date(fecha);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
};

export const getMetodoPagoUI = (metodo) => {
  const normalizado = metodo?.toLowerCase() || "";
  if (normalizado === "efectivo") {
    return { Icon: Banknote, iconColor: "text-emerald-500" };
  }
  if (normalizado === "tarjeta") {
    return { Icon: CreditCard, iconColor: "text-green-500" };
  }
  if (normalizado === "transferencia") {
    return { Icon: ArrowRightLeft, iconColor: "text-violet-500" };
  }
  return { Icon: CreditCard, iconColor: "text-gray-400" };
};
