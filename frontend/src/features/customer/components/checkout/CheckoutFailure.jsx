import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Ban,
  Clock,
  Home,
  RotateCcw,
  XCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  rejected: {
    icon: XCircle,
    title: "Pago rechazado",
    description:
      "El pago no pudo procesarse. Verifica los datos e intenta nuevamente.",
    bgGradient: "from-red-500 to-red-600",
    bgIcon: "bg-red-500/20",
    iconColor: "text-red-500",
    borderColor: "border-red-100",
    bgLight: "from-red-50 via-white to-slate-50",
  },
  cancelled: {
    icon: Ban,
    title: "Compra cancelada",
    description:
      "Cancelaste el proceso de pago. No se realizó ningún cargo.",
    bgGradient: "from-amber-500 to-amber-600",
    bgIcon: "bg-amber-500/20",
    iconColor: "text-amber-500",
    borderColor: "border-amber-100",
    bgLight: "from-amber-50 via-white to-slate-50",
  },
  pending: {
    icon: Clock,
    title: "Pago pendiente",
    description:
      "El pago está siendo procesado. Te notificaremos cuando se confirme.",
    bgGradient: "from-blue-500 to-blue-600",
    bgIcon: "bg-blue-500/20",
    iconColor: "text-blue-500",
    borderColor: "border-blue-100",
    bgLight: "from-blue-50 via-white to-slate-50",
  },
  default: {
    icon: AlertTriangle,
    title: "Algo salió mal",
    description:
      "Ocurrió un error inesperado durante el proceso de compra.",
    bgGradient: "from-slate-600 to-slate-700",
    bgIcon: "bg-white/20",
    iconColor: "text-slate-500",
    borderColor: "border-slate-200",
    bgLight: "from-slate-50 via-white to-slate-50",
  },
};

const CheckoutFailure = () => {
  const navigate = useNavigate();
  const [statusType, setStatusType] = useState("default");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawStatus = params.get("status") || "";
    if (["rejected", "cancelled", "pending"].includes(rawStatus)) {
      setStatusType(rawStatus);
    }
  }, []);

  const config = STATUS_CONFIG[statusType];
  const Icon = config.icon;

  return (
    <div
      className={`min-h-screen bg-linear-to-b ${config.bgLight} px-4 py-10`}
    >
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div
          className={`border-b ${config.borderColor} bg-linear-to-r ${config.bgGradient} p-8 text-white`}
        >
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className={`mb-4 rounded-full ${config.bgIcon} p-3`}>
              <Icon className="h-11 w-11" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {config.title}
            </h1>
            <p className="mt-2 text-white/80">{config.description}</p>
          </div>
        </div>

        <div className="space-y-4 p-6 md:p-8">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            {statusType === "rejected" &&
              "Puede deberse a fondos insuficientes, datos incorrectos o bloqueos del banco. Revisa tu método de pago e intentá de nuevo."}
            {statusType === "cancelled" &&
              "Si querés completar la compra, podés volver a intentar cuando quieras. Tu carrito sigue guardado."}
            {statusType === "pending" &&
              "El pago puede demorar unos minutos en acreditarse. Si el problema persiste, contactanos."}
            {statusType === "default" &&
              "Si el error persiste, comunicate con nosotros para ayudarte a resolverlo."}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/checkout", { replace: true })}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-xs transition-all hover:bg-primary-700 active:scale-[0.98]"
            >
              <RotateCcw className="h-4 w-4" />
              Reintentar pago
            </button>
            <button
              onClick={() => navigate("/", { replace: true })}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 active:scale-[0.98]"
            >
              <Home className="h-4 w-4" />
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFailure;
