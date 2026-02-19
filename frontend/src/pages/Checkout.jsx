import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useCarritoStore } from "../store/useCarritoStore";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import { FiShoppingBag, FiArrowLeft, FiTag, FiShield } from "react-icons/fi";
import Header from "../components/Header";
import { ChevronRight, Home } from "lucide-react";
import CheckoutForm from "../components/CheckoutForm";

// Función de utilidad para formatear precio a ARS (moneda con símbolo)
const formatPrice = (value) => {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const Checkout = () => {
  const navigate = useNavigate();
  const { carrito } = useCarritoStore();
  const { token } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState(null); // Guardar código aplicado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Debes iniciar sesión para realizar una compra");
      navigate("/login", {
        state: { from: "/checkout" },
      });
      return;
    }
    setIsAuthenticated(true);
  }, [navigate, token]);

  // Cálculo del subtotal
  const subtotal = useMemo(() => {
    return carrito.reduce((acc, prod) => {
      const priceToUse =
        prod.precioFinal || prod.precioRegular || prod.precio || 0;
      const price =
        typeof priceToUse === "string"
          ? parseFloat(priceToUse.replace(/[^0-9.-]+/g, "")) || 0
          : Number(priceToUse) || 0;
      return acc + price * prod.cantidad;
    }, 0);
  }, [carrito]);

  const total = Math.max(subtotal - appliedDiscount, 0);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error("Ingresa un código de cupón");
      return;
    }

    try {
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/cupones/validar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          auth: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codigo: discountCode.trim().toUpperCase(),
          montoCompra: subtotal,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAppliedDiscount(data.data.descuento);
        setAppliedCouponCode(discountCode.trim().toUpperCase());
        toast.success(
          `¡Cupón aplicado! Descuento: ${formatPrice(data.data.descuento)}`,
        );
      } else {
        setAppliedDiscount(0);
        setAppliedCouponCode(null);
        toast.error(data.message || "Cupón no válido");
      }
    } catch (error) {
      console.error("Error validando cupón:", error);
      setAppliedDiscount(0);
      setAppliedCouponCode(null);
      toast.error("Error al validar el cupón");
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(0);
    setAppliedCouponCode(null);
    setDiscountCode("");
    toast.info("Cupón removido");
  };

  const onSubmit = useCallback(
    async (data) => {
      if (!token) {
        toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
        navigate("/login");
        return;
      }

      setIsProcessing(true);
      try {
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000";
        const urlApiCompleta = `${backendUrl}/mercadopago/create-order`;

        console.log("📤 Enviando solicitud al backend...");

        const response = await fetch(urlApiCompleta, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            auth: `Bearer ${token}`,
          },
          body: JSON.stringify({
            products: carrito.map((product) => ({
              id: product.idProducto,
              quantity: product.cantidad,
            })),
            customer_info: {
              name: data.nombre.split(" ")[0] || "",
              surname: data.nombre.split(" ").slice(1).join(" ") || "",
              email: data.email,
              phone: data.telefono,
              address: {
                street_name: "Retiro en tienda",
                street_number: "0",
                zip_code: "0000",
              },
            },
            discount: appliedDiscount,
            codigoCupon: appliedCouponCode, // Enviar código del cupón al backend
          }),
        });

        const responseData = await response.json();

        console.log(
          "📦 Respuesta del backend:",
          JSON.stringify(responseData, null, 2),
        );

        if (!response.ok) {
          throw new Error(responseData.message || `Error ${response.status}`);
        }

        // ✅ ADAPTACIÓN PARA FORZAR SANDBOX LOCALMENTE
        // El backend ahora devuelve la URL de sandbox en el campo init_point
        const initPoint = responseData.init_point;

        if (!initPoint) {
          throw new Error("No se recibió URL de pago del servidor");
        }

        // Información del Pago simplificada para pruebas locales
        const paymentMode = "PRUEBAS (FORZADO)";

        console.log("\n🎯 Información del Pago:");
        console.log("- Modo:", paymentMode);
        console.log("- URL de pago (Sandbox):", initPoint);
        console.log("- Preference ID:", responseData.id);
        console.log("- Total:", responseData.total);
        console.log("⚠️ MODO PRUEBAS (FORZADO):");
        console.log("  - Usar tarjetas de prueba de Mercado Pago");
        console.log("  - Los pagos NO son reales");

        if (responseData.success) {
          const toastMessage = "Redirigiendo a Mercado Pago (Modo Pruebas)...";

          toast.info(toastMessage, {
            autoClose: 2000,
          });

          // Pequeño delay para que se vea el toast
          setTimeout(() => {
            console.log("🚀 Redirigiendo a:", initPoint);
            window.location.href = initPoint;
          }, 1000);

          return;
        } else {
          throw new Error(
            responseData.message || "No se pudo crear la URL de pago",
          );
        }
      } catch (error) {
        console.error("❌ Error creating order:", error);

        if (error.message.includes("401") || error.message.includes("Token")) {
          toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
          navigate("/login");
        } else {
          toast.error(
            error.message || "Error al conectar con el servicio de pago",
          );
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [carrito, appliedDiscount, navigate, token],
  );

  const formatPrecio = (price) => {
    const numericPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[^0-9.-]+/g, ""))
        : Number(price);
    if (isNaN(numericPrice)) return "0,00";
    return new Intl.NumberFormat("es-AR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };

  // Manejo de carrito vacío
  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto my-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Carrito Vacío
            </h2>
            <p className="text-gray-600 mb-6">
              No hay productos en tu carrito para checkout.
            </p>
            <Link
              to="/productos"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Volver a Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Manejo de autenticación pendiente
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto my-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando autenticación...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container my-12">
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex items-center space-x-2">
            <li className="flex items-center">
              <NavLink
                to="/"
                className="flex items-center gap-1 hover:text-primary-700 transition-colors"
              >
                <Home size={16} className="text-gray-500" />
                Inicio
              </NavLink>
            </li>
            <li className="flex items-center">
              <ChevronRight size={16} className="text-gray-400" />
            </li>
            <li className="flex items-center">
              <NavLink
                to="/carrito"
                className="hover:text-primary-700 transition-colors"
              >
                Carrito
              </NavLink>
            </li>
            <li className="flex items-center">
              <ChevronRight size={16} className="text-gray-400" />
            </li>
            <li className="flex items-center">
              <span className="font-medium text-gray-700">Checkout</span>
            </li>
          </ol>
        </nav>
      </div>

      <div>
        <div className="flex flex-col lg:flex-row gap-8 pb-12">
          <div className="lg:flex-1">
            <CheckoutForm onSubmit={onSubmit} isProcessing={isProcessing} />
          </div>

          {/* Columna del Resumen */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-4">
              {/* Header*/}
              <div className="bg-gradient-to-t from-primary-600 to-primary-700 px-4 py-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white backdrop-blur-sm">
                    <FiShoppingBag className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Resumen del Pedido</h2>
                    <p className="text-white text-sm">
                      {carrito.reduce((acc, prod) => acc + prod.cantidad, 0)}{" "}
                      articulo
                    </p>
                  </div>
                </div>
              </div>

              {/* Contenido*/}
              <div className="px-4 py-6">
                {/* Lista de productos */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {carrito.map((product) => {
                    const price =
                      parseFloat(
                        product.precioFinal ||
                          product.precioRegular ||
                          product.precio,
                      ) || 0;
                    const total = price * product.cantidad;

                    return (
                      <div
                        key={product.idProducto}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={product.img}
                            alt={product.nombreProducto}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.nombreProducto}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              Cantidad: {product.cantidad}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              ${formatPrecio(total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cupón de descuento */}
                <div className="mb-6">
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiTag className="w-4 h-4 mr-1 text-primary-600" />
                    Cupón de descuento
                  </label>

                  {appliedCouponCode ? (
                    // Cupón aplicado - mostrar con botón para remover
                    <div className="flex space-x-2">
                      <div className="flex-1 px-3 py-2 bg-green-50 border-2 border-green-500 rounded-lg flex items-center justify-between">
                        <span className="text-green-700 font-medium text-sm">
                          {appliedCouponCode} aplicado
                        </span>
                        <span className="text-green-600 font-semibold text-sm">
                          - {formatPrice(appliedDiscount)}
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveDiscount}
                        className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors text-sm"
                        title="Quitar cupón"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    // Sin cupón - mostrar input y botón aplicar
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Ingresar cupón"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleApplyDiscount()
                        }
                      />
                      <button
                        onClick={handleApplyDiscount}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}

                  {discountCode.toUpperCase() === "PIXEL2025" &&
                    !appliedDiscount && (
                      <p className="text-green-600 text-xs mt-1">
                        Cupón válido: PIXEL2025 - 10% OFF
                      </p>
                    )}
                </div>

                {/* Resumen de precios */}
                <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Descuento</span>
                      <span className="font-medium">
                        - {formatPrice(appliedDiscount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Retiro en Tienda</span>
                    <span className="font-medium text-primary-700">GRATIS</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary-700">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
