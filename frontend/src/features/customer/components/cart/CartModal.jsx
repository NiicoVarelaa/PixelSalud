import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarritoStore } from "@store/useCarritoStore";
import {
  FiX,
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiPackage,
  FiTag,
} from "react-icons/fi";
import Default from "@assets/default.webp";
import apiClient from "@utils/apiClient";
import { motion, AnimatePresence } from "framer-motion";

const CartModal = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const {
    carrito,
    isCartModalOpen,
    setIsCartModalOpen,
    eliminarDelCarrito,
    disminuirCantidad,
    aumentarCantidad,
    vaciarCarrito,
    sincronizarCarrito,
  } = useCarritoStore();

  const [imagenesPrincipales, setImagenesPrincipales] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);

  // Sincronizar carrito al abrir modal
  useEffect(() => {
    if (isCartModalOpen) {
      sincronizarCarrito();
    }
  }, [isCartModalOpen, sincronizarCarrito]);

  // Cargar imágenes principales
  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      await Promise.all(
        carrito.map(async (prod) => {
          try {
            const res = await apiClient.get(
              `/productos/${prod.idProducto}/imagenes/principal`,
            );
            newImages[prod.idProducto] =
              res.data?.urlImagen || prod.img || Default;
          } catch {
            newImages[prod.idProducto] = prod.img || Default;
          }
        }),
      );
      setImagenesPrincipales(newImages);
    };
    if (carrito.length > 0) {
      fetchImages();
    }
  }, [carrito]);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isCartModalOpen) {
        setIsCartModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isCartModalOpen, setIsCartModalOpen]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isCartModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartModalOpen]);

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

  const handleDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    eliminarDelCarrito(productToDelete);
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleEmptyCart = () => {
    vaciarCarrito();
    setShowEmptyCartModal(false);
  };

  const handleCheckout = () => {
    setIsCartModalOpen(false);
    navigate("/checkout");
  };

  const handleQuantityChange = (id, type) => {
    if (type === "increase") {
      aumentarCantidad(id);
    } else {
      disminuirCantidad(id);
    }
  };

  // Calcular totales
  const subtotal = carrito.reduce((acc, prod) => {
    const priceToUse =
      prod.precioFinal || prod.precioRegular || prod.precio || 0;
    const price =
      typeof priceToUse === "string"
        ? parseFloat(priceToUse.replace(/[^0-9.-]+/g, "")) || 0
        : Number(priceToUse) || 0;
    return acc + price * prod.cantidad;
  }, 0);

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const hasRealDiscount = (product) => {
    const hasDiscount =
      product.enOferta &&
      product.porcentajeDescuento &&
      product.porcentajeDescuento > 0;

    const hasPriceDifference =
      product.precioRegular &&
      product.precioFinal &&
      product.precioFinal < product.precioRegular;

    return hasDiscount || hasPriceDifference;
  };

  if (!isCartModalOpen) return null;

  return (
    <AnimatePresence>
      {isCartModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998"
            onClick={() => setIsCartModalOpen(false)}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-9999 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-linear-to-r from-primary-600 to-primary-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg backdrop-blur-sm">
                  <FiShoppingCart className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Mi Carrito</h2>
                  <p className="text-sm text-white/90">
                    {totalItems} {totalItems === 1 ? "producto" : "productos"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar carrito"
              >
                <FiX className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="w-32 h-32 mb-6 text-gray-300">
                    <FiShoppingCart className="w-full h-full" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Agrega productos para comenzar tu compra
                  </p>
                  <button
                    onClick={() => {
                      setIsCartModalOpen(false);
                      navigate("/productos");
                    }}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FiPackage className="w-5 h-5" />
                    Ver productos
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
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
                    const showDiscountBadge = hasRealDiscount(product);

                    return (
                      <motion.div
                        key={product.idProducto}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4">
                          {/* Imagen del producto */}
                          <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={
                                imagenesPrincipales[product.idProducto] ||
                                product.img ||
                                Default
                              }
                              alt={product.nombreProducto}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = Default;
                              }}
                            />
                          </div>

                          {/* Info del producto */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                              {product.nombreProducto}
                            </h4>

                            {/* Precio y descuento */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-primary-600">
                                ${formatPrice(price)}
                              </span>
                              {showDiscountBadge && (
                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center">
                                  <FiTag className="w-3 h-3 mr-1" />-
                                  {product.porcentajeDescuento}%
                                </span>
                              )}
                            </div>

                            {/* Controles de cantidad */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  className={`w-7 h-7 flex items-center justify-center rounded-md border ${
                                    product.cantidad > 1
                                      ? "border-red-300 hover:bg-red-50 text-red-600 cursor-pointer"
                                      : "border-gray-300 text-gray-400 cursor-not-allowed"
                                  } transition-colors`}
                                  onClick={() =>
                                    handleQuantityChange(
                                      product.idProducto,
                                      "decrease",
                                    )
                                  }
                                  disabled={product.cantidad <= 1}
                                >
                                  <FiMinus className="w-3 h-3" />
                                </button>
                                <span className="min-w-8 text-center font-medium text-sm">
                                  {product.cantidad}
                                </span>
                                <button
                                  className={`w-7 h-7 flex items-center justify-center rounded-md border ${
                                    product.stock > product.cantidad
                                      ? "border-green-300 hover:bg-green-50 text-green-600 cursor-pointer"
                                      : "border-gray-300 text-gray-400 cursor-not-allowed"
                                  } transition-colors`}
                                  onClick={() =>
                                    handleQuantityChange(
                                      product.idProducto,
                                      "increase",
                                    )
                                  }
                                  disabled={product.stock <= product.cantidad}
                                >
                                  <FiPlus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Botón eliminar */}
                              <button
                                onClick={() => handleDelete(product.idProducto)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                aria-label="Eliminar producto"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Advertencia de stock bajo */}
                            {product.stock <= 5 && product.stock > 0 && (
                              <p className="text-xs text-red-500 mt-2">
                                ¡Solo quedan {product.stock} en stock!
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Subtotal del producto */}
                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Subtotal:
                          </span>
                          <span className="font-semibold text-gray-900">
                            ${formatPrice(total)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer con totales y acciones */}
            {carrito.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                {/* Botón vaciar carrito */}
                <button
                  onClick={() => setShowEmptyCartModal(true)}
                  className="w-full text-sm text-red-500 hover:text-red-700 flex items-center justify-center gap-2 py-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Vaciar carrito
                </button>

                {/* Resumen de totales */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-900">
                      ${formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-linear-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Finalizar Compra
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsCartModalOpen(false);
                      navigate("/productos");
                    }}
                    className="w-full py-3 bg-white border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors cursor-pointer"
                  >
                    Seguir comprando
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Modal de confirmación para eliminar producto */}
          {showDeleteModal && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-10000 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  cancelDelete();
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
              >
                <div className="flex items-center justify-center p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <FiTrash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  ¿Eliminar producto?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Modal de confirmación para vaciar carrito */}
          {showEmptyCartModal && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-10000 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowEmptyCartModal(false);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
              >
                <div className="flex items-center justify-center p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <FiTrash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  ¿Vaciar carrito?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Se eliminarán todos los productos de tu carrito.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEmptyCartModal(false)}
                    className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEmptyCart}
                    className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Vaciar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
