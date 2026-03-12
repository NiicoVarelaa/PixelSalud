import { useEffect, useCallback } from "react";
import { useOfertasStore } from "../store/useOfertasStore";
import { useProductStore } from "@store/useProductStore";
import { useAuthStore } from "@store/useAuthStore";
import axios from "axios";
import { toast } from "react-toastify";

export const useOfertasData = () => {
  const { productos: productosGlobal, fetchProducts } = useProductStore();
  const token = useAuthStore((state) => state.token);

  const {
    setProductos,
    setIdsProductosEnCampanas,
    setCargando,
    idsProductosEnCampanas,
  } = useOfertasStore();

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getConfig = useCallback(
    () => ({
      headers: { Auth: `Bearer ${token}` },
    }),
    [token],
  );

  // Fetch productos en campañas activas
  const fetchProductosEnCampanas = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/campanas/activas`);
      const ids = new Set();

      for (const campana of response.data) {
        const prodResponse = await axios.get(
          `${backendUrl}/campanas/${campana.idCampana}/productos`,
        );
        prodResponse.data.productos?.forEach((p) => ids.add(p.idProducto));
      }

      setIdsProductosEnCampanas(Array.from(ids));
    } catch (error) {
      console.error("Error al obtener productos en campañas:", error);
      toast.error("Error al cargar productos de campañas");
    }
  }, [backendUrl, setIdsProductosEnCampanas]);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        if (productosGlobal.length === 0) {
          await fetchProducts();
        }
        await fetchProductosEnCampanas();
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar - dependencias manejadas intencionalmente

  // Sincronizar productos del store global
  useEffect(() => {
    setProductos(productosGlobal);
  }, [productosGlobal, setProductos]);

  // Verificar si producto está en campaña
  const estaEnCampana = useCallback(
    (idProducto) => {
      return idsProductosEnCampanas.includes(idProducto);
    },
    [idsProductosEnCampanas],
  );

  // Cambiar oferta de un producto
  const handleCambiarOferta = useCallback(
    async (producto, activar, porcentaje = null) => {
      if (estaEnCampana(producto.idProducto)) {
        toast.error(
          "Este producto está en una campaña activa. No se pueden aplicar ofertas individuales.",
          { icon: "⚠️" },
        );
        return;
      }

      try {
        setCargando(true);

        const datosActualizacion = {
          enOferta: activar,
          porcentajeDescuento: activar ? porcentaje : 0,
        };

        await axios.put(
          `${backendUrl}/productos/actualizar/${producto.idProducto}`,
          datosActualizacion,
          getConfig(),
        );

        toast.success(
          activar
            ? `¡Oferta ${porcentaje}% aplicada a ${producto.nombreProducto}!`
            : `Oferta removida de ${producto.nombreProducto}`,
          { icon: activar ? "🎉" : "✅" },
        );

        await fetchProducts();
      } catch (error) {
        console.error("Error al actualizar oferta:", error);
        toast.error(
          error.response?.data?.message || "Error al actualizar la oferta",
          { icon: "❌" },
        );
      } finally {
        setCargando(false);
      }
    },
    [estaEnCampana, backendUrl, getConfig, fetchProducts, setCargando],
  );

  return {
    estaEnCampana,
    handleCambiarOferta,
  };
};
