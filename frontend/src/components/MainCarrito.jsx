import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarritoStore } from "../store/useCarritoStore";
import CardResumen from "./CardResumen";
import {
  FiShoppingBag,
  FiArrowLeft,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiHelpCircle,
  FiArrowRight,
  FiTag,
  FiAlertCircle,
  FiShoppingCart,
  FiArrowLeftCircle
} from "react-icons/fi";
import Breadcrumbs from "./Breadcrumbs";

const MainCarrito = ({ breadcrumbsCategoria }) => {
  const navigate = useNavigate();
  const {
    carrito,
    eliminarDelCarrito,
    disminuirCantidad,
    aumentarCantidad,
    vaciarCarrito,
    sincronizarCarrito,
  } = useCarritoStore();
  const [highlightChanges, setHighlightChanges] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);

  useEffect(() => {
    sincronizarCarrito();
  }, [sincronizarCarrito]);

  useEffect(() => {
    if (Object.keys(highlightChanges).length > 0) {
      const timer = setTimeout(() => {
        setHighlightChanges({});
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [highlightChanges]);

  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  const handleDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    eliminarDelCarrito(productToDelete);
    setShowDeleteModal(false);
    setShowSuccessAlert(true);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleQuantityChange = (id, type) => {
    setHighlightChanges((prev) => ({ ...prev, [id]: type }));

    if (type === "increase") {
      aumentarCantidad(id);
    } else {
      disminuirCantidad(id);
    }
  };

  const formatPrice = (price) => {
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

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  // Función para verificar si hay descuento real
  const hasRealDiscount = (product) => {
    // Verificar si el producto está en oferta Y tiene un porcentaje de descuento mayor a 0
    const hasDiscount = product.enOferta && 
                       product.porcentajeDescuento && 
                       product.porcentajeDescuento > 0;
    
    // También verificar si hay diferencia entre precio regular y precio final
    const hasPriceDifference = product.precioRegular && 
                              product.precioFinal && 
                              product.precioFinal < product.precioRegular;
    
    return hasDiscount || hasPriceDifference;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showEmptyCartModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEmptyCartModal(false);
            }
          }}
        >
          <div className="flex flex-col items-center bg-white shadow-lg rounded-xl py-6 px-5 md:w-[460px] w-full max-w-[370px] border border-gray-200">
            <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
              <FiTrash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-gray-900 font-semibold mt-4 text-xl">
              ¿Vaciar carrito?
            </h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Se eliminarán todos los productos de tu carrito.
            </p>
            <div className="flex items-center justify-center gap-4 mt-5 w-full">
              <button
                type="button"
                onClick={() => setShowEmptyCartModal(false)}
                className="w-full md:w-36 h-10 rounded-lg border-2 border-primary-700 bg-white text-primary-700 font-medium text-sm hover:bg-primary-100 active:scale-95 transition cursor-pointer"
              >
                Mantener
              </button>
              <button
                type="button"
                onClick={() => {
                  vaciarCarrito();
                  setShowEmptyCartModal(false);
                }}
                className="w-full md:w-36 h-10 rounded-lg text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition cursor-pointer"
              >
                Sí, vaciar
              </button>
            </div>
          </div>
        </div>
      )}

      {carrito.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <div className="max-w-md transform transition-all duration-300 hover:scale-105">
            <div className="w-48 h-48 mx-auto flex items-center justify-center text-gray-300">
              <FiShoppingCart className="w-full h-full opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            <h2 className="text-2xl font-medium text-gray-700 mt-6">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-500 mt-2 mb-6">
              Añade productos a tu carrito para comenzar.
            </p>
            <Link
              to="/productos"
              className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FiArrowLeftCircle className="h-5 w-5 mr-2" />
              Descubrir productos
            </Link>
          </div>
        </div>
      ) : (
        <div className="my-12">
          <Breadcrumbs categoria={breadcrumbsCategoria} />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:flex-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
                        <FiShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                          Carrito de Compras
                        </h2>
                        <p className="text-gray-500 text-sm">
                          Revisa tus productos antes de finalizar
                        </p>
                      </div>
                    </div>
                    <span className="bg-secondary-100 text-secondary-800 text-xs font-semibold px-3 py-1 rounded-lg">
                      {carrito.length}{" "}
                      {carrito.length === 1 ? "Producto" : "Productos"}
                    </span>
                  </div>
                </div>

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
                    const priceToUse =
                      product.precioFinal ||
                      product.precioRegular ||
                      product.precio;

                    const price =
                      typeof priceToUse === "number"
                        ? priceToUse
                        : parseFloat(priceToUse);

                    const total = price * product.cantidad;
                    const isHighlighted = highlightChanges[product.idProducto];
                    
                    // Verificar si realmente tiene descuento
                    const showDiscountBadge = hasRealDiscount(product);

                    return (
                      <div
                        key={product.idProducto}
                        className={`flex flex-col md:grid md:grid-cols-10 gap-4 items-center py-5 px-4 transition-all duration-300 ${
                          isHighlighted === "increase"
                            ? "bg-green-50"
                            : isHighlighted === "decrease"
                            ? "bg-red-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Product Info (Image, Name, Color, Delete button) - Full width on mobile */}
                        <div className="w-full md:col-span-5 flex items-start space-x-4">
                          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 relative">
                            <img
                              className="w-full h-full object-cover"
                              src={product.img}
                              alt={product.nombreProducto}
                            />
                            
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
                            <button
                              onClick={() => handleDelete(product.idProducto)}
                              className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center transition-colors cursor-pointer"
                            >
                              <FiTrash2 className="h-3.5 w-3.5 mr-1" />
                              Eliminar
                            </button>
                            
                            {showDeleteModal && (
                              <div
                                className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
                                onClick={(e) => {
                                  if (e.target === e.currentTarget) {
                                    cancelDelete();
                                  }
                                }}
                              >
                                <div className="flex flex-col items-center bg-white shadow-lg rounded-xl py-6 px-5 md:w-[460px] w-full max-w-[370px] border border-gray-200">
                                  <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
                                    <FiTrash2 className="w-6 h-6 text-red-600" />
                                  </div>
                                  <h2 className="text-gray-900 font-semibold mt-4 text-xl">
                                    ¿Eliminar este producto?
                                  </h2>
                                  <p className="text-sm text-gray-600 mt-2 text-center">
                                    Esta acción no se puede deshacer.
                                  </p>
                                  <div className="flex items-center justify-center gap-4 mt-5 w-full">
                                    <button
                                      type="button"
                                      onClick={cancelDelete}
                                      className="w-full md:w-36 h-10 rounded-lg border-2 border-primary-700 bg-white text-primary-700 font-medium text-sm hover:bg-primary-100 active:scale-95 transition cursor-pointer"
                                    >
                                      Mantener
                                    </button>
                                    <button
                                      type="button"
                                      onClick={confirmDelete}
                                      className="w-full md:w-36 h-10 rounded-lg text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition cursor-pointer"
                                    >
                                      Sí, eliminar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Mobile Quantity, and Subtotal */}
                        <div className="w-full md:hidden flex justify-between items-center mt-4">
                          {/* Quantity */}
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-semibold text-gray-500 uppercase">
                              Cantidad
                            </span>
                            <div className="flex items-center justify-center mt-1">
                              <button
                                className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                                  product.cantidad > 1
                                    ? "border-red-300 hover:bg-red-50 text-red-600 cursor-pointer"
                                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                                } transition-colors`}
                                onClick={() =>
                                  handleQuantityChange(
                                    product.idProducto,
                                    "decrease"
                                  )
                                }
                                disabled={product.cantidad <= 1}
                              >
                                <FiMinus className="w-3 h-3" />
                              </button>
                              <span className="mx-3 min-w-[2rem] text-center font-medium text-sm">
                                {product.cantidad}
                              </span>
                              <button
                                className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                                  product.stock > product.cantidad
                                    ? "border-green-300 hover:bg-green-50 text-green-600 cursor-pointer"
                                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                                } transition-colors`}
                                onClick={() =>
                                  handleQuantityChange(
                                    product.idProducto,
                                    "increase"
                                  )
                                }
                                disabled={product.stock <= product.cantidad}
                              >
                                <FiPlus className="w-3 h-3" />
                              </button>
                            </div>
                            {product.stock <= 5 && product.stock > 0 && (
                              <span className="mt-2 text-xs text-red-500">
                                ¡Solo quedan {product.stock} en stock!
                              </span>
                            )}
                          </div>
                          {/* Subtotal */}
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-semibold text-gray-500 uppercase">
                              Subtotal
                            </span>
                            <span className="font-semibold text-gray-900 text-sm mt-1">
                              ${formatPrice(total)}
                            </span>
                            {showDiscountBadge && (
                              <span className="mt-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center">
                                <FiTag className="w-3 h-3 mr-1" />
                                -{product.porcentajeDescuento}% OFF
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="hidden md:flex flex-col items-center justify-center md:col-span-3">
                          <div className="flex items-center justify-center">
                            <button
                              className={`w-8 h-8 flex items-center justify-center rounded-lg border ${
                                product.cantidad > 1
                                  ? "border-red-300 hover:bg-red-50 text-red-600 cursor-pointer"
                                  : "border-gray-300 text-gray-400 cursor-not-allowed"
                              } transition-colors`}
                              onClick={() =>
                                handleQuantityChange(
                                  product.idProducto,
                                  "decrease"
                                )
                              }
                              disabled={product.cantidad <= 1}
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <span className="mx-3 min-w-[2rem] text-center font-medium text-sm">
                              {product.cantidad}
                            </span>
                            <button
                              className={`w-8 h-8 flex items-center justify-center rounded-lg border ${
                                product.stock > product.cantidad
                                  ? "border-green-300 hover:bg-green-50 text-green-600 cursor-pointer"
                                  : "border-gray-300 text-gray-400 cursor-not-allowed"
                              } transition-colors`}
                              onClick={() =>
                                handleQuantityChange(
                                  product.idProducto,
                                  "increase"
                                )
                              }
                              disabled={product.stock <= product.cantidad}
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                          {product.stock <= 5 && product.stock > 0 && (
                            <span className="mt-2 text-xs text-red-500">
                              ¡Solo quedan {product.stock} en stock!
                            </span>
                          )}
                        </div>

                        <div className="hidden md:flex flex-col items-end justify-center md:col-span-2 text-right">
                          <span className="font-semibold text-gray-900 text-sm">
                            ${formatPrice(total)}
                          </span>
                          {showDiscountBadge && (
                            <span className="mt-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center">
                              <FiTag className="w-3 h-3 mr-1" />
                              -{product.porcentajeDescuento}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-4 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <Link
                    to="/productos"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200 group"
                  >
                    <FiArrowLeft className="h-4 w-4 mr-2 inline transition-transform duration-200 group-hover:-translate-x-1" />
                    Continuar comprando
                  </Link>

                  <button
                    onClick={() => setShowEmptyCartModal(true)}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center transition-colors cursor-pointer"
                  >
                    <FiTrash2 className="h-4 w-4 mr-1" />
                    Vaciar carrito
                  </button>
                </div>
              </div>

              <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiAlertCircle className="text-orange-400 mr-2 h-5 w-5" />
                  ¿Necesitas ayuda?
                </h3>
                <div className="flex items-start">
                  <div className="text-orange-400 mr-3 mt-0.5">
                    <FiHelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">
                      Si tienes dudas sobre tu compra o necesitas asistencia,
                      nuestro equipo está disponible 24/7.
                    </p>
                    <Link
                      to="/contacto"
                      className="mt-2 text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center transition-colors cursor-pointer group"
                    >
                      Contactar soporte
                      <FiArrowRight className="ml-2 h-4 w-4 inline transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-96 sticky top-4 h-fit">
              <CardResumen onProceedToCheckout={handleProceedToCheckout} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainCarrito;