import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "@utils/apiClient";

export const useCuponesData = () => {
  const [cupones, setCupones] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fetchCupones = async () => {
    try {
      setCargando(true);
      const response = await apiClient.get("/cupones");
      setCupones(response.data.data || []);
    } catch (error) {
      toast.error("Error al cargar cupones");
      console.error("Error:", error);
      setCupones([]);
    } finally {
      setCargando(false);
    }
  };

  const fetchHistorial = async () => {
    try {
      const response = await apiClient.get("/cupones/historial");
      setHistorial(response.data.data || []);
    } catch (error) {
      toast.error("Error al cargar historial");
      console.error("Error:", error);
      setHistorial([]);
    }
  };

  const crearCupon = async (nuevoCupon, onSuccess) => {
    // Validación
    if (
      !nuevoCupon.codigo ||
      !nuevoCupon.tipoCupon ||
      !nuevoCupon.valorDescuento ||
      !nuevoCupon.fechaInicio ||
      !nuevoCupon.fechaVencimiento
    ) {
      toast.error("Los campos marcados con * son obligatorios");
      return false;
    }

    if (parseFloat(nuevoCupon.valorDescuento) <= 0) {
      toast.error("El valor del descuento debe ser mayor a 0");
      return false;
    }

    if (
      nuevoCupon.tipoCupon === "porcentaje" &&
      parseFloat(nuevoCupon.valorDescuento) > 100
    ) {
      toast.error("El porcentaje no puede ser mayor a 100");
      return false;
    }

    try {
      await apiClient.post("/cupones", nuevoCupon);
      toast.success("Cupón creado exitosamente");
      await fetchCupones();
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear cupón");
      console.error("Error:", error);
      return false;
    }
  };

  const cambiarEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";

    try {
      await apiClient.patch(`/cupones/${id}/estado`, { estado: nuevoEstado });
      toast.success(
        `Cupón ${nuevoEstado === "activo" ? "activado" : "desactivado"}`,
      );
      await fetchCupones();
      return true;
    } catch (error) {
      toast.error("Error al cambiar estado del cupón");
      console.error("Error:", error);
      return false;
    }
  };

  const eliminarCupon = async (id) => {
    try {
      await apiClient.delete(`/cupones/${id}`);
      toast.success("Cupón eliminado exitosamente");
      await fetchCupones();
      return true;
    } catch (error) {
      toast.error("Error al eliminar cupón");
      console.error("Error:", error);
      return false;
    }
  };

  const getEstadisticas = () => {
    const total = cupones.length;
    const activos = cupones.filter((c) => c.estado === "activo").length;
    const inactivos = cupones.filter((c) => c.estado === "inactivo").length;
    const expirados = cupones.filter((c) => c.estado === "expirado").length;
    const vecesUsadoTotal = cupones.reduce(
      (sum, c) => sum + (c.vecesUsado || 0),
      0,
    );

    return {
      total,
      activos,
      inactivos,
      expirados,
      vecesUsadoTotal,
    };
  };

  useEffect(() => {
    fetchCupones();
    fetchHistorial();
  }, []);

  return {
    cupones,
    historial,
    cargando,
    fetchCupones,
    fetchHistorial,
    crearCupon,
    cambiarEstado,
    eliminarCupon,
    estadisticas: getEstadisticas(),
  };
};
