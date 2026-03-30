import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCarritoStore } from "@store/useCarritoStore";
import { useAuthStore } from "@store/useAuthStore";
import {
  FiCheckCircle,
  FiLoader,
  FiShoppingBag,
  FiHome,
  FiClock,
  FiTruck,
} from "react-icons/fi";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vaciarCarritoLocal = useCarritoStore((state) => state.vaciarCarrito);
  const { token } = useAuthStore();
  const [countdown, setCountdown] = useState(3);
  const [status, setStatus] = useState("approved");

  const targetPath = "/perfil/mis-compras";

  const clearCartInDB = useCallback(async () => {
    if (!token) {
      console.warn(
        "Token no disponible. No se puede limpiar el carrito en DB. Se asume que el webhook lo gestiono.",
      );
      return;
    }

    try {
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const urlApiCompleta = `${backendUrl}/mercadopago/clearUserCart`;

      const response = await fetch(urlApiCompleta, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          auth: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Carrito limpiado en la base de datos (DELETE API).");
      } else {
        const errorData = await response.json();
        console.error("Error al limpiar carrito en DB:", errorData.message);
      }
    } catch (error) {
      console.error("Error de conexion al limpiar carrito:", error);
    }
  }, [token]);

  useEffect(() => {
    const paymentStatus = searchParams.get("status") || "approved";
    setStatus(paymentStatus);

    vaciarCarritoLocal();

    if (paymentStatus === "approved" && token) {
      clearCartInDB();
    }

    let currentCount = 3;
    const timer = setInterval(() => {
      currentCount -= 1;
      setCountdown(currentCount);

      if (currentCount <= 0) {
        clearInterval(timer);
        navigate(targetPath, { replace: true });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams, vaciarCarritoLocal, token, clearCartInDB, navigate]);

  const isApproved = status === "approved";

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-emerald-100 bg-white shadow-xl">
        <div className="border-b border-emerald-100 bg-linear-to-r from-emerald-500 to-emerald-600 p-8 text-white">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-white/20 p-3">
              <FiCheckCircle className="h-11 w-11" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isApproved ? "Pago aprobado" : "Pago procesado"}
            </h1>
            <p className="mt-2 text-emerald-50">
              {isApproved
                ? "Tu compra se acredito correctamente. Ya estamos preparando tu pedido para retiro."
                : "Tu operacion finalizo. Revisa el estado de tu compra en tu perfil."}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <FiShoppingBag className="mx-auto mb-2 h-5 w-5 text-emerald-600" />
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Estado
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {isApproved ? "Confirmado" : "Finalizado"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <FiTruck className="mx-auto mb-2 h-5 w-5 text-emerald-600" />
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Entrega
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                Retiro en tienda
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <FiClock className="mx-auto mb-2 h-5 w-5 text-emerald-600" />
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Actualizacion
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">Por email</p>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm text-slate-700">
            Recibiras una confirmacion con los detalles de tu pedido y el estado
            del retiro. Tambien podes seguirlo desde Mis compras.
          </div>

          <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-gray-600">
            <FiLoader className="animate-spin" />
            <p className="text-sm">
              Redirigiendo en{" "}
              <span className="font-bold text-primary-700">{countdown}</span>{" "}
              segundos...
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate(targetPath, { replace: true })}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700"
            >
              <FiShoppingBag className="h-4 w-4" />
              Ver mis compras
            </button>
            <Link
              to="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <FiHome className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
