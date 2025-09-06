import { useState, useMemo } from "react";
import {
  FiShoppingBag,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { FaCreditCard, FaMoneyBillWave, FaUniversity } from "react-icons/fa";
import Swal from "sweetalert2";
import { useCompraStore } from "../store/useCompraStore";
import { useCarritoStore } from "../store/useCarritoStore";
import ModalTarjetaCredito from "./ModalTarjetaCredito";
import ModalTransferencia from "./ModalTransferencia";
import ModalEfectivo from "./ModalEfectivo";
import ModalTipoEntrega from "./ModalTipoEntrega";
import ModalFormularioEnvio from "./ModalFormularioEnvio";
import { toast } from 'react-toastify';

const paymentMethods = [
  { id: "creditCard", name: "Tarjeta de Crédito", icon: <FaCreditCard /> },
  { id: "bankTransfer", name: "Transferencia Bancaria", icon: <FaUniversity /> },
  { id: "cash", name: "Efectivo", icon: <FaMoneyBillWave /> },
];

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);

const CardCompra = ({ onPurchaseCompleted }) => {
  const { carrito, vaciarCarrito } = useCarritoStore();
  const { realizarCompraCarrito } = useCompraStore();
  const [showCardModal, setShowCardModal] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);

  // nuevos estados para entrega
  const [showTipoEntrega, setShowTipoEntrega] = useState(false);
  const [showFormularioEnvio, setShowFormularioEnvio] = useState(false);
  const [tempMetodoPago, setTempMetodoPago] = useState(null);

  const subtotal = useMemo(
    () => carrito.reduce((acc, prod) => acc + parseFloat(prod.precio) * prod.cantidad, 0),
    [carrito]
  );
  const taxes = subtotal * 0.21;
  const discountAmount = appliedDiscount ? subtotal * 0.1 : 0;
  const total = subtotal + taxes - discountAmount;

  const applyDiscount = () => {
    if (!discountCode.trim()) return;
    if (discountCode.toLowerCase() === "pixel2025") {
      setAppliedDiscount({ code: discountCode, value: subtotal * 0.1 });
      toast.success("¡Cupón aplicado! 10% de descuento");
    } else {
      toast.error("Cupón inválido");
    }
    setDiscountCode("");
  };

  const handleSuccess = () => {
    Swal.fire({
      title: "¡Compra exitosa!",
      text: "Tu pedido ha sido procesado correctamente",
      icon: "success",
      confirmButtonText: "Ver mis pedidos",
      showCancelButton: true,
      cancelButtonText: "Seguir comprando",
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'px-6 py-2 mr-1 bg-white font-medium text-primary-700 hover:bg-primary-100 transition-all rounded-lg cursor-pointer border border-primary-700 shadow-sm hover:shadow-md border-2',
        cancelButton: 'px-6 py-2 ml-1 font-medium bg-primary-700 text-white hover:bg-primary-800 transition-all rounded-lg cursor-pointer border border-primary-700 shadow-sm hover:shadow-md',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        onPurchaseCompleted("/MisCompras");
      } else {
        vaciarCarrito();
        onPurchaseCompleted("/productos");
      }
    });
  };

  const handleCheckout = () => {
    if (!selectedPayment) {
      Swal.fire({
        title: "Atención",
        text: "Por favor, selecciona un método de pago antes de continuar.",
        icon: "info",
        confirmButtonText: "Entendido",
        customClass: {
          confirmButton: 'px-6 py-2 font-medium bg-primary-700 text-white hover:bg-primary-800 transition-all rounded-lg cursor-pointer border border-primary-700 shadow-sm hover:shadow-md'
        },
        buttonsStyling: false,
      });
      return;
    }
    if (selectedPayment === "creditCard") setShowCardModal(true);
    if (selectedPayment === "bankTransfer") setShowTransferModal(true);
    if (selectedPayment === "cash") setShowCashModal(true);
  };

  const handleCardConfirm = () => {
    setShowCardModal(false);
    setTempMetodoPago("Tarjeta de Crédito");
    setShowTipoEntrega(true);
  };

  const handleTransferConfirm = () => {
    setShowTransferModal(false);
    setTempMetodoPago("Transferencia Bancaria");
    setShowTipoEntrega(true);
  };

  const handleCashConfirm = async () => {
    setIsProcessing(true);
    setShowCashModal(false);
    try {
      await realizarCompraCarrito("Efectivo", "Sucursal");
      handleSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  // seleccion tipo entrega
  const handleSelectTipoEntrega = (tipo) => {
    setShowTipoEntrega(false);
    if (tipo === "Envio") {
      setShowFormularioEnvio(true);
    } else {
      procesarCompra(tempMetodoPago, "Sucursal");
    }
  };

  // confirmacion de envio
  const handleConfirmEnvio = (direccion) => {
    setShowFormularioEnvio(false);
    procesarCompra(tempMetodoPago, "Envio", direccion);
  };

  const procesarCompra = async (metodoPago, tipoEntrega, direccionEnvio = null) => {
    setIsProcessing(true);
    try {
      await realizarCompraCarrito(metodoPago, tipoEntrega, direccionEnvio);
      handleSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
            <FiShoppingBag className="w-5 h-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Resumen de compra
          </h2>
        </div>

        {/* Detalles */}
        <div className="space-y-3 mb-4 mt-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">IVA</span>
            <span className="font-medium">{formatPrice(taxes)}</span>
          </div>
          {appliedDiscount && (
            <div className="flex justify-between text-primary-700">
              <span>Descuento ({appliedDiscount.code})</span>
              <span className="font-medium">-{formatPrice(discountAmount)}</span>
            </div>
          )}
        </div>

        {/* Cupón */}
        <div className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Ingresa tu cupon de descuento"
              className="flex-1 px-4 py-2 border border-r-0 border-gray-200 rounded-l-lg focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button
              onClick={applyDiscount}
              className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 cursor-pointer"
            >
              Aplicar
            </button>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="mb-6">
          <button
            onClick={() => setShowPaymentMethods(!showPaymentMethods)}
            className="w-full flex justify-between items-center text-gray-800 font-medium mb-2"
          >
            <span className="cursor-pointer hover:text-primary-700">Métodos de pago</span>
            {showPaymentMethods ? (
              <FiChevronUp className="w-5 h-5 cursor-pointer hover:text-primary-700" />
            ) : (
              <FiChevronDown className="w-5 h-5 cursor-pointer hover:text-primary-700" />
            )}
          </button>

          {showPaymentMethods && (
            <div className="space-y-3 mt-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    selectedPayment === method.id
                      ? "border-primary-100 bg-primary-100 text-primary-900"
                      : "border-gray-200 hover:border-primary-100 hover:bg-primary-100 text-primary-900"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{method.icon}</span>
                    <span>{method.name}</span>
                  </div>
                  {selectedPayment === method.id && (
                    <span className="text-primary-900 font-bold">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary-700">
              {formatPrice(total)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className={`w-full py-3 px-6 rounded-lg font-bold text-white ${
              isProcessing
                ? "bg-primary-700"
                : "bg-primary-700 hover:bg-primary-800 cursor-pointer transition-colors"
            }`}
          >
            {isProcessing ? "Procesando..." : "Finalizar compra"}
          </button>
        </div>
      </div>

      {/* Modales */}
      <ModalTarjetaCredito
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onConfirm={handleCardConfirm}
      />
      <ModalTransferencia
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onConfirm={handleTransferConfirm}
      />
      <ModalEfectivo
        isOpen={showCashModal}
        onClose={() => setShowCashModal(false)}
        onConfirm={handleCashConfirm}
      />
      <ModalTipoEntrega
        isOpen={showTipoEntrega}
        onClose={() => setShowTipoEntrega(false)}
        onSelect={handleSelectTipoEntrega}
      />
      <ModalFormularioEnvio
        isOpen={showFormularioEnvio}
        onClose={() => setShowFormularioEnvio(false)}
        onConfirm={handleConfirmEnvio}
      />
    </>
  );
};

export default CardCompra;
