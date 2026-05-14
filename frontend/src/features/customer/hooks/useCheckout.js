import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCarritoStore } from "@store/useCarritoStore";
import { useAuthStore } from "@store/useAuthStore";
import { toast } from "react-toastify";
import { sucursalesData } from "@data/sucursalesData";
import apiClient from "@utils/apiClient";
import { parsePriceFromString } from "@utils/priceUtils";
import { formatCurrency } from "@utils/formatMoneda";

export const useCheckout = () => {
  const navigate = useNavigate();
  const { carrito, setIsCartModalOpen } = useCarritoStore();
  const { token, user } = useAuthStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [personalData, setPersonalData] = useState({
    email: user?.email || "",
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    fechaNacimiento: "",
    dni: user?.dni ? String(user.dni) : "",
    celular: "",
    aceptaTyC: false,
  });
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  useEffect(() => {
    if (!token) {
      toast.error("Debes iniciar sesión para realizar una compra");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    setIsAuthenticated(true);
  }, [navigate, token]);

  useEffect(() => {
    setPersonalData((prev) => ({
      ...prev,
      email: prev.email || user?.email || "",
      nombre: prev.nombre || user?.nombre || "",
      apellido: prev.apellido || user?.apellido || "",
      dni: prev.dni || (user?.dni ? String(user.dni) : ""),
    }));
  }, [user]);

  const subtotal = useMemo(() => {
    return carrito.reduce((acc, prod) => {
      const price = parsePriceFromString(
        prod.precioFinal || prod.precioRegular || prod.precio || 0,
      );
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
      const response = await apiClient.post("/cupones/validar", {
        codigo: discountCode.trim().toUpperCase(),
        montoCompra: subtotal,
      });

      const data = response.data;

      if (data.success) {
        setAppliedDiscount(data.data.descuento);
        setAppliedCouponCode(discountCode.trim().toUpperCase());
        toast.success(
          `¡Cupón aplicado! Descuento: ${formatCurrency(data.data.descuento)}`,
        );
      } else {
        setAppliedDiscount(0);
        setAppliedCouponCode(null);
        toast.error(data.message || "Cupón no válido");
      }
    } catch {
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

  const handleContinuePersonalData = useCallback((data) => {
    setPersonalData(data);
    setCurrentStep(2);
  }, []);

  const handleSelectBranch = useCallback((branchId) => {
    setSelectedBranchId(branchId);
  }, []);

  const handleContinuePickup = useCallback(() => {
    if (!selectedBranchId) {
      toast.error("Selecciona una sucursal para continuar");
      return;
    }
    setCurrentStep(3);
  }, [selectedBranchId]);

  const handleBackToPersonalData = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const handleBackToPickup = useCallback(() => {
    setCurrentStep(2);
  }, []);

  const onSubmit = useCallback(async () => {
    if (!token) {
      toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
      navigate("/login");
      return;
    }

    if (!selectedBranchId) {
      toast.error("Selecciona una sucursal para continuar");
      setCurrentStep(2);
      return;
    }

    const selectedBranch = sucursalesData.find(
      (branch) => branch.id === selectedBranchId,
    );

    setIsProcessing(true);
    try {
      const response = await apiClient.post("/mercadopago/create-order", {
        products: carrito.map((product) => ({
          id: product.idProducto,
          quantity: product.cantidad,
        })),
        customer_info: {
          name: personalData.nombre,
          surname: personalData.apellido,
          email: personalData.email,
          phone: personalData.celular,
          address: {
            street_name: selectedBranch?.address || "Retiro en tienda",
            street_number: "0",
            zip_code: selectedBranch?.zipCode || "0000",
          },
        },
        checkout_data: {
          dni: personalData.dni,
          fechaNacimiento: personalData.fechaNacimiento,
          celular: personalData.celular,
          aceptaTyC: personalData.aceptaTyC,
          sucursalCodigo: selectedBranch?.id || "",
          sucursalNombre: selectedBranch?.name || "",
          sucursalDireccion: selectedBranch?.address || "",
          legalVersion: "checkout_2026_03",
        },
        discount: appliedDiscount,
        codigoCupon: appliedCouponCode,
      });

      const responseData = response.data;
      const checkoutUrl =
        responseData.checkout_url ||
        responseData.init_point ||
        responseData.sandbox_init_point;

      if (!checkoutUrl)
        throw new Error("No se recibió URL de pago del servidor");

      if (responseData.success) {
        toast.info("Redirigiendo a Mercado Pago...", { autoClose: 2000 });
        setTimeout(() => {
          window.location.href = checkoutUrl;
        }, 1000);
      } else {
        throw new Error(
          responseData.message || "No se pudo crear la URL de pago",
        );
      }
    } catch (error) {
      if (error.message?.includes("401") || error.message?.includes("Token")) {
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
  }, [
    token,
    selectedBranchId,
    carrito,
    personalData,
    appliedDiscount,
    appliedCouponCode,
    navigate,
  ]);

  return {
    appliedCouponCode,
    appliedDiscount,
    branches: sucursalesData,
    carrito,
    currentStep,
    discountCode,
    isAuthenticated,
    isProcessing,
    personalData,
    selectedBranchId,
    subtotal,
    total,
    formatCurrency,
    handleApplyDiscount,
    handleBackToPersonalData,
    handleBackToPickup,
    handleContinuePersonalData,
    handleContinuePickup,
    handleRemoveDiscount,
    handleSelectBranch,
    onSubmit,
    setDiscountCode,
    setIsCartModalOpen,
  };
};
