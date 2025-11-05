import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarritoStore } from "../store/useCarritoStore";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import {
  FiShoppingBag,
  FiUser,
  FiArrowLeft,
  FiTag,
  FiMapPin,
  FiMail,
  FiPhone,
  FiHome,
  FiCreditCard,
  FiShield,
  FiCheck,
  FiLock,
} from "react-icons/fi";
import Header from "../components/Header";

let mercadoPagoInitialized = false;
const initializeMercadoPago = async () => {
  if (!mercadoPagoInitialized && window.MercadoPago) {
    try {
      // Nota: El import de '@mercadopago/sdk-react' es asíncrono en el archivo original
      const { initMercadoPago } = await import("@mercadopago/sdk-react");
      initMercadoPago("APP_USR-338dfdb1-f95c-4629-9edb-dbeaeac039d0", {
        locale: "es-AR",
      });
      mercadoPagoInitialized = true;
    } catch (error) {
      console.error("Error initializing Mercado Pago:", error);
      toast.error("Error al inicializar el sistema de pagos");
    }
  }
};

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
  const { carrito, vaciarCarrito } = useCarritoStore();
  const { token } = useAuthStore(); // 👈 Obtener el token directamente de Zustand
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [preferenceId, setPreferenceId] = useState(null);
  const [shouldCreateOrder, setShouldCreateOrder] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    calle: "",
    numero: "",
    departamento: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Verificar autenticación al cargar el componente usando el token de Zustand
  useEffect(() => {
    // Usamos el token del store
    if (!token) {
      toast.error("Debes iniciar sesión para realizar una compra");
      navigate("/login", {
        state: { from: "/checkout" },
      });
      return;
    }
    setIsAuthenticated(true);
  }, [navigate, token]); // Dependencia del token

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) errors.nombre = "Nombre completo es requerido";
    if (!formData.email.trim()) {
      errors.email = "Email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email no válido";
    }
    if (!formData.telefono.trim()) errors.telefono = "Teléfono es requerido";
    if (!formData.calle.trim()) errors.calle = "Calle es requerida";
    if (!formData.numero.trim()) errors.numero = "Número es requerido";
    if (!formData.ciudad.trim()) errors.ciudad = "Ciudad es requerida";
    if (!formData.estado.trim()) errors.estado = "Estado es requerido";
    if (!formData.codigoPostal.trim())
      errors.codigoPostal = "Código postal es requerido";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === "PIXEL2025") {
      const discount = subtotal * 0.1;
      setAppliedDiscount(discount);
      toast.success(`¡Cupón aplicado! Descuento: ${formatPrice(discount)}`);
    } else {
      setAppliedDiscount(0);
      toast.error("Cupón no válido. Prueba con 'PIXEL2025'");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const isFormComplete = useMemo(() => {
    return [
      formData.nombre,
      formData.email,
      formData.telefono,
      formData.calle,
      formData.numero,
      formData.ciudad,
      formData.estado,
      formData.codigoPostal,
    ].every((val) => val && val.trim() !== "");
  }, [formData]);

  // Efecto para crear la orden de pago con JWT
  useEffect(() => {
    const createOrder = async () => {
      if (!isFormComplete) {
        toast.error("Por favor completa todos los campos requeridos");
        return;
      }

      if (!validateForm()) {
        toast.error("Por favor corrige los errores en el formulario");
        return;
      }

      // ❌ Se elimina getAuthToken() y se utiliza el 'token' del hook
      if (!token) {
        // 👈 Usamos el token de Zustand
        toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
        navigate("/login");
        return;
      }

      setIsProcessing(true);
      try {
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000";
        const urlApiCompleta = `${backendUrl}/mercadopago/create-order`;

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
              name: formData.nombre.split(" ")[0] || "",
              surname: formData.nombre.split(" ").slice(1).join(" ") || "",
              email: formData.email,
              phone: formData.telefono,
              address: {
                street_name: formData.calle,
                street_number: formData.numero,
                zip_code: formData.codigoPostal,
              },
            },
            discount: appliedDiscount,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Error ${response.status}`);
        }

        if (data.success && data.id) {
          // Si el backend devuelve init_point lo usamos para redirigir al Checkout Pro
          if (data.init_point) {
            toast.info("Redirigiendo a Mercado Pago...");
            window.location.href = data.init_point; // abre Checkout Pro en la misma pestaña
            return;
          }
          setPreferenceId(data.id);
          setCurrentStep(2);
          await initializeMercadoPago();
          toast.success("¡Orden creada! Procede con el pago");
        } else {
          throw new Error(data.message || "No se pudo crear la orden de pago");
        }
      } catch (error) {
        console.error("Error creating order:", error);

        if (error.message.includes("401") || error.message.includes("Token")) {
          // Si falla por 401, forzamos la redirección
          toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
          navigate("/login");
        } else {
          toast.error(
            error.message || "Error al conectar con el servicio de pago"
          );
        }
      } finally {
        setIsProcessing(false);
        setShouldCreateOrder(false);
      }
    };

    if (shouldCreateOrder && isAuthenticated) {
      createOrder();
    }
  }, [
    shouldCreateOrder,
    carrito,
    formData,
    isFormComplete,
    appliedDiscount,
    isAuthenticated,
    navigate,
    token,
  ]); // Dependencia del token

  // Render Mercado Pago Wallet cuando esté listo
  useEffect(() => {
    if (preferenceId && window.MercadoPago) {
      const renderWallet = async () => {
        try {
          // Nota: El import de '@mercadopago/sdk-react' es asíncrono en el archivo original
          const { Wallet } = await import("@mercadopago/sdk-react");
          const walletContainer = document.getElementById("wallet_container");
          if (walletContainer) {
            // Limpiar contenedor antes de renderizar
            walletContainer.innerHTML = "";

            Wallet({
              initialization: { preferenceId: preferenceId },
              customization: {
                texts: {
                  action: "pay",
                  valueProp: "security_safety",
                },
              },
            }).render(walletContainer);
          }
        } catch (error) {
          console.error("Error rendering Mercado Pago wallet:", error);
          toast.error("Error al cargar el método de pago");
        }
      };

      renderWallet();
    }
  }, [preferenceId]);

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

  // Si el carrito está vacío
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

  // Si no está autenticado, mostrar loading
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

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl my-12 shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-8">
            <div
              className={`flex items-center space-x-2 ${
                currentStep >= 1 ? "text-primary-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 1
                    ? "bg-primary-600 border-primary-600 text-white"
                    : "border-gray-300"
                }`}
              >
                {currentStep > 1 ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <span>1</span>
                )}
              </div>
              <span className="font-medium">Datos de Envío</span>
            </div>

            <div
              className={`flex-1 h-1 ${
                currentStep >= 2 ? "bg-primary-600" : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center space-x-2 ${
                currentStep >= 2 ? "text-primary-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 2
                    ? "bg-primary-600 border-primary-600 text-white"
                    : "border-gray-300"
                }`}
              >
                2
              </div>
              <span className="font-medium">Pago</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col lg:flex-row gap-8 pb-12">
          {/* Columna principal */}
          <div className="lg:flex-1">
            {currentStep === 1 ? (
              // Paso 1: Datos de Envío
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Datos de Envío
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Completa tus datos para el envío
                    </p>
                  </div>
                </div>
                {/* Indicador de seguridad */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-green-700">
                    <FiLock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Sesión segura iniciada
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información Personal */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiUser className="w-4 h-4 mr-2 text-primary-600" />
                      Información Personal
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          placeholder="Tu nombre completo"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            formErrors.nombre
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}
                        />
                        {formErrors.nombre && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.nombre}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FiMail className="w-4 h-4 inline mr-1" />
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="ejemplo@email.com"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              formErrors.email
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {formErrors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FiPhone className="w-4 h-4 inline mr-1" />
                            Teléfono *
                          </label>
                          <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            placeholder="+54 11 1234-5678"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              formErrors.telefono
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {formErrors.telefono && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.telefono}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dirección de Envío */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiMapPin className="w-4 h-4 mr-2 text-primary-600" />
                      Dirección de Envío
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Código Postal *
                          </label>
                          <input
                            type="text"
                            name="codigoPostal"
                            value={formData.codigoPostal}
                            onChange={handleInputChange}
                            placeholder="C.P."
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              formErrors.codigoPostal
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {formErrors.codigoPostal && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.codigoPostal}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FiHome className="w-4 h-4 inline mr-1" />
                            Calle *
                          </label>
                          <input
                            type="text"
                            name="calle"
                            value={formData.calle}
                            onChange={handleInputChange}
                            placeholder="Nombre de la calle"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              formErrors.calle
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {formErrors.calle && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.calle}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número *
                          </label>
                          <input
                            type="text"
                            name="numero"
                            value={formData.numero}
                            onChange={handleInputChange}
                            placeholder="N°"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              formErrors.numero
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {formErrors.numero && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.numero}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Departamento / Referencias (Opcional)
                        </label>
                        <input
                          type="text"
                          name="departamento"
                          value={formData.departamento}
                          onChange={handleInputChange}
                          placeholder="Piso, departamento, etc."
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ciudad *
                          </label>
                          <input
                            type="text"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleInputChange}
                            placeholder="Tu ciudad"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              formErrors.ciudad
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {formErrors.ciudad && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.ciudad}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado/Provincia *
                          </label>
                          <input
                            type="text"
                            name="estado"
                            value={formData.estado}
                            onChange={handleInputChange}
                            placeholder="Tu estado/provincia"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              formErrors.estado
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {formErrors.estado && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.estado}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <Link
                    to="/carrito"
                    className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 group"
                  >
                    <FiArrowLeft className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                    Volver al carrito
                  </Link>

                  <button
                    onClick={() => setShouldCreateOrder(true)}
                    disabled={!isFormComplete || isProcessing}
                    className={`inline-flex items-center px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                      !isFormComplete || isProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                    }`}
                  >
                    <FiCreditCard className="w-5 h-5 mr-2" />
                    {isProcessing ? "Procesando..." : "Continuar al Pago"}
                  </button>
                </div>
              </div>
            ) : (
              // Paso 2: Pago
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
                    <FiCreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Método de Pago
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Completa tu pago de forma segura
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <FiShield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Pago 100% Seguro
                      </h3>
                      <p className="text-blue-700 text-sm">
                        Tu información está protegida con encriptación SSL.
                        Mercado Pago procesa tu pago de forma segura.
                      </p>
                    </div>
                  </div>
                </div>

                {preferenceId ? (
                  <div>
                    <div id="wallet_container" className="mb-6">
                      {/* Mercado Pago Wallet se renderizará aquí */}
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 group"
                      >
                        <FiArrowLeft className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                        Volver a datos de envío
                      </button>

                      <div className="text-sm text-gray-500">
                        ¿Problemas con el pago?{" "}
                        <button className="text-primary-600 hover:text-primary-700">
                          Contactar soporte
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Preparando método de pago...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Columna del Resumen */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-4">
              {/* Header*/}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                    <FiShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Resumen del Pedido</h2>
                    <p className="text-primary-100 text-sm opacity-90">
                      {carrito.reduce((acc, prod) => acc + prod.cantidad, 0)}{" "}
                      productos
                    </p>
                  </div>
                </div>
              </div>

              {/* Contenido*/}
              <div className="p-6">
                {/* Lista de productos */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {carrito.map((product) => {
                    const price =
                      parseFloat(
                        product.precioFinal ||
                          product.precioRegular ||
                          product.precio
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

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Envío</span>
                    <span className="font-medium">Calculado al finalizar</span>
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

                {/* Beneficios */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <FiShield className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Compra 100% segura</span>
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
