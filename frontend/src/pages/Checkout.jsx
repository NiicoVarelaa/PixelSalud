import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCarritoStore } from "../store/useCarritoStore";
import { toast } from "react-toastify";
import {
  FiShoppingBag,
  FiUser,
  FiArrowLeft,
  FiTag,
} from "react-icons/fi";
import Header from "../components/Header";
// Importa las dependencias de Mercado Pago
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializa el SDK de Mercado Pago con tu clave pública
// Reemplaza 'YOUR_PUBLIC_KEY' con tu clave pública real
initMercadoPago('APP_USR-338dfdb1-f95c-4629-9edb-dbeaeac039d0', { locale: 'es-AR' });


const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);

const Checkout = () => {
  const { carrito } = useCarritoStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  // Nuevo estado para guardar el ID de la preferencia de pago
  const [preferenceId, setPreferenceId] = useState(null);
  // Estado para disparar la creación de la orden
  const [shouldCreateOrder, setShouldCreateOrder] = useState(false);

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

  const subtotal = useMemo(
    () => carrito.reduce((acc, prod) => acc + parseFloat(prod.precio) * prod.cantidad, 0),
    [carrito]
  );
  const total = subtotal - appliedDiscount;

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === "PIXEL2025") {
      setAppliedDiscount(subtotal * 0.10);
      toast.success("¡Cupón aplicado con éxito!");
    } else {
      setAppliedDiscount(0);
      toast.error("Cupón no válido.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isFormComplete = [
    formData.nombre,
    formData.email,
    formData.telefono,
    formData.calle,
    formData.numero,
    formData.ciudad,
    formData.estado,
    formData.codigoPostal,
  ].every((val) => val && val.trim() !== "");


  // Efecto para crear la orden de pago cuando se solicita
  useEffect(() => {
    const createOrder = async () => {
      setIsProcessing(true);
      try {
        // Cambia la URL por la de tu backend/ngrok
        const response = await fetch("http://localhost:5000/mercadopago/create-order", {
          method: "POST",
           headers: {
    'Content-Type': 'application/json',
  },
          body: JSON.stringify({
            products: carrito.map((p) => ({ id: p.idProducto, quantity: p.cantidad })),
            customer_info: {
              name: formData.nombre,
              surname: "",
              email: formData.email,
            },
          }),
        });
        const data = await response.json();
        if (data.id) {
          setPreferenceId(data.id);
        } else {
          toast.error("No se pudo iniciar el pago con Mercado Pago.");
        }
      } catch {
        toast.error("Error al conectar con Mercado Pago.");
      } finally {
        setIsProcessing(false);
        setShouldCreateOrder(false);
      }
    };
    if (shouldCreateOrder) {
      createOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldCreateOrder]);

  const formatPrecio = (price) => {
    const numericPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[^0-9.-]+/g, ""))
        : Number(price);

    if (isNaN(numericPrice)) {
      return "0,00";
    }

    return new Intl.NumberFormat("es-AR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto my-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna principal: Productos, formulario y envío */}
          <div className="lg:flex-1 bg-white p-8 rounded-xl shadow-sm">
            <div className="px-4 py-5 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
                  <FiShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Finalizar Compra
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Revisa tu pedido y completa tus datos de envío.
                  </p>
                </div>
              </div>
            </div>
            {/* Lista de Productos */}
            <div className="mb-8 pt-8">
              <div className="hidden md:grid grid-cols-10 gap-4 py-3 px-4 bg-gray-50 border-b border-gray-100">
                <div className="col-span-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Producto
                  </p>
                </div>
                <div className="col-span-3 text-center">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </p>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {carrito.map((product) => {
                  const price =
                    typeof product.precio === "number"
                      ? product.precio
                      : parseFloat(product.precio);
                  const total = price * product.cantidad;

                  return (
                    <div
                      key={product.idProducto}
                      className="flex flex-col md:grid md:grid-cols-10 gap-4 items-center py-5 px-4 transition-all duration-300 hover:bg-gray-50"
                    >
                      <div className="w-full md:col-span-5 flex items-start space-x-4">
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 relative">
                          <img
                            className="w-full h-full object-cover"
                            src={product.img}
                            alt={product.nombreProducto}
                          />
                          {product.descuento && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{product.descuento}%
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 line-clamp-2">
                            {product.nombreProducto}
                          </h3>
                          {product.color && (
                            <div className="flex items-center mt-1">
                              <span className="text-gray-500 text-xs mr-2">
                                Color:
                              </span>
                              <span
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: product.color }}
                                title={product.color}
                              ></span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col items-center justify-center md:col-span-3">
                        <div className="flex items-center justify-center">
                          <span className="mx-3 min-w-[2rem] text-center font-medium text-sm">
                            {product.cantidad}
                          </span>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center justify-end md:col-span-2 text-right">
                        <span className="font-semibold text-gray-900 text-sm">
                          ${formatPrecio(total)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link
                to="/carrito"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200 group"
              >
                <FiArrowLeft className="h-4 w-4 mr-2 inline transition-transform duration-200 group-hover:-translate-x-1" />
                Volver al carrito
              </Link>
            </div>
            {/* Sección de Datos del Usuario y Envío */}
            <div className="mb-8 border-t border-gray-200 pt-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
                  <FiUser className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Datos de Envío
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Tu nombre completo"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ejemplo@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Tu teléfono de contacto"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    placeholder="C.P."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calle</label>
                  <input
                    type="text"
                    name="calle"
                    value={formData.calle}
                    onChange={handleInputChange}
                    placeholder="Nombre de la calle"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    placeholder="N° de calle"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento / Referencias (Opcional)</label>
                  <input
                    type="text"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    placeholder="Piso, departamento, etc."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    placeholder="Tu ciudad"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    placeholder="Tu estado/provincia"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Columna del Resumen de Compra y Pago */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 sticky top-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
                  <FiShoppingBag className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Resumen del Pedido
                </h2>
              </div>
              {/* Sección de Cupón de Descuento */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiTag className="text-primary-700 mr-2" />
                  Cupón de Descuento
                </h2>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ingresar cupón"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <button
                    onClick={handleApplyDiscount}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
              {/* Detalles */}
              <div className="space-y-3 mb-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-green-600">Descuento</span>
                    <span className="font-medium">- {formatPrice(appliedDiscount)}</span>
                  </div>
                )}
              </div>
              {/* Botón Mercado Pago */}
              <div className="mb-8">
                {!preferenceId ? (
                  <button
                    onClick={() => setShouldCreateOrder(true)}
                    disabled={!isFormComplete || isProcessing}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-white mt-4 ${
                      !isFormComplete || isProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-700 hover:bg-primary-800 cursor-pointer transition-colors"
                    }`}
                  >
                    {isProcessing ? "Procesando..." : "Pagar con Mercado Pago"}
                  </button>
                ) : (
                  <div className="mt-4">
                    <Wallet initialization={{ preferenceId: preferenceId }} />
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
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
  );
};

export default Checkout;