import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCarritoStore } from "@store/useCarritoStore";
import { useAuthStore } from "@store/useAuthStore";
import { toast } from "react-toastify";
import { sucursalesData } from "@data/sucursalesData";

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

  const formatPrice = (value) => {
    const numericValue = Number(value) || 0;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error("Ingresa un código de cupón");
      return;
    }

    try {
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${backendUrl}/mercadopago/create-order`, {
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
        }),
      });

      const responseData = await response.json();
      if (!response.ok)
        throw new Error(responseData.message || `Error ${response.status}`);
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
    carrito,
    isAuthenticated,
    isProcessing,
    discountCode,
    appliedDiscount,
    appliedCouponCode,
    subtotal,
    total,
    currentStep,
    personalData,
    selectedBranchId,
    branches: sucursalesData,
    setDiscountCode,
    setIsCartModalOpen,
    handleApplyDiscount,
    handleRemoveDiscount,
    handleContinuePersonalData,
    handleSelectBranch,
    handleContinuePickup,
    handleBackToPersonalData,
    handleBackToPickup,
    onSubmit,
    formatPrice,
  };
};
