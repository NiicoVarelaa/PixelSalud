import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCarritoStore } from "@store/useCarritoStore";
import { useAuthStore } from "@store/useAuthStore";
import { FiCheckCircle, FiLoader } from "react-icons/fi";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vaciarCarritoLocal = useCarritoStore((state) => state.vaciarCarrito);
  const { token } = useAuthStore(); // 👈 OBTENER TOKEN
  const [countdown, setCountdown] = useState(3);

  // ✅ URL ABSOLUTA Y FORZADA AL ENTORNO LOCAL
  const LOCAL_SUCCESS_URL = "http://localhost:5173/perfil/mis-compras";

  // ---------------------------------------------------------------------
  // FUNCIÓN PARA LIMPIAR EL CARRITO EN LA BASE DE DATOS (VIA BACKEND/NGROK)
  // ---------------------------------------------------------------------
  const clearCartInDB = useCallback(async () => {
    if (!token) {
      console.warn(
        "❌ Token no disponible. No se puede limpiar el carrito en DB. Asumiendo que el webhook lo hizo.",
      );
      return;
    }

    try {
      // Usar la URL de tu backend (ngrok) para la llamada DELETE
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const urlApiCompleta = `${backendUrl}/mercadopago/clearUserCart`;

      const response = await fetch(urlApiCompleta, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          auth: `Bearer ${token}`, // Envía el token para autenticar
        },
      });

      if (response.ok) {
        console.log("✅ Carrito limpiado en la base de datos (DELETE API).");
      } else {
        const errorData = await response.json();
        console.error("❌ Error al limpiar carrito en DB:", errorData.message);
        // toast.error("Advertencia: La base de datos no se limpió correctamente.");
      }
    } catch (error) {
      console.error("❌ Error de conexión al limpiar carrito:", error);
    }
  }, [token]);

  useEffect(() => {
    const status = searchParams.get("status");

    // 1. Limpiar el estado local (para la página actual de Vercel)
    vaciarCarritoLocal();

    // 2. Limpiar el carrito de la DB si el pago fue aprobado
    if (status === "approved" && token) {
      // Llamar a la API para limpiar la tabla Carrito de MySQL
      clearCartInDB();
    }

    // 3. Iniciar el contador de redirección
    let currentCount = 3;
    const timer = setInterval(() => {
      currentCount -= 1;
      setCountdown(currentCount);

      if (currentCount <= 0) {
        clearInterval(timer);

        // 🚀 SOLUCIÓN: FORZAR REDIRECCIÓN EXTERNA (A LOCALHOST)
        // window.location.replace rompe el contexto de Vercel
        window.location.replace(LOCAL_SUCCESS_URL);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams, vaciarCarritoLocal, token, clearCartInDB]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          ¡Pago Exitoso!
        </h1>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6">
          Tu compra ha sido procesada correctamente. El pedido está listo para
          ser retirado en nuestra tienda.
        </p>

        {/* Información adicional */}
        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">✨ Importante:</span> Recibirás un
            correo de confirmación con los detalles de tu pedido.
          </p>
        </div>

        {/* Contador */}
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <FiLoader className="animate-spin" />
          <p className="text-sm">
            Redirigiendo a tus compras locales en{" "}
            <span className="font-bold text-primary-600">{countdown}</span>{" "}
            segundos...
          </p>
        </div>

        {/* Botón manual - AHORA REDIRIGE A LOCALHOST */}
        <button
          // 🚀 SOLUCIÓN: Botón también usa window.location.replace
          onClick={() => window.location.replace(LOCAL_SUCCESS_URL)}
          className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Ver mis compras (Local) ahora
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
