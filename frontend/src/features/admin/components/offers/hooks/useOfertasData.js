import { useEffect, useCallback, createElement } from "react";
import { useOfertasStore } from "../store/useOfertasStore";
import { useProductStore } from "@store/useProductStore";
import { useAuthStore } from "@store/useAuthStore";
import axios from "axios";
import { toast } from "react-toastify";
import { AlertTriangle, PartyPopper, CircleCheck, CircleX } from "lucide-react";

const toastError = (message, icon = createElement(CircleX, { size: 16 })) =>
  toast.error(message, {
    icon,
  });

const toastSuccess = (message, icon) =>
  toast.success(message, {
    icon,
  });

export const useOfertasData = () => {
  const { productos: productosGlobal, fetchProducts } = useProductStore();
  const token = useAuthStore((state) => state.token);

  const {
    setProductos,
    setIdsProductosEnCampanas,
    setCargando,
    setCargandoId,
    idsProductosEnCampanas,
  } = useOfertasStore();

  const backendUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const getConfig = useCallback(
    () => ({
      headers: { Auth: `Bearer ${token}` },
    }),
    [token],
  );

  const fetchProductosEnCampanas = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/campanas/activas`);
      const ids = new Set();

      const productosPorCampana = await Promise.all(
        response.data.map((campana) =>
          axios.get(`${backendUrl}/campanas/${campana.idCampana}/productos`),
        ),
      );

      productosPorCampana.forEach((prodResponse) => {
        prodResponse.data.productos?.forEach((p) => ids.add(p.idProducto));
      });

      setIdsProductosEnCampanas(Array.from(ids));
    } catch (error) {
      console.error("Error al obtener productos en campañas:", error);
      toastError("Error al cargar productos de campañas");
    }
  }, [backendUrl, setIdsProductosEnCampanas]);

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
  }, []);

  useEffect(() => {
    setProductos(productosGlobal);
  }, [productosGlobal, setProductos]);

  const estaEnCampana = useCallback(
    (idProducto) => {
      return idsProductosEnCampanas.includes(idProducto);
    },
    [idsProductosEnCampanas],
  );

  const handleCambiarOferta = useCallback(
    async (producto, activar, porcentaje = null, fechas = null) => {
      if (estaEnCampana(producto.idProducto)) {
        toastError(
          "Este producto está en una campaña activa. No se pueden aplicar ofertas individuales.",
          createElement(AlertTriangle, { size: 16 }),
        );
        return;
      }

      if (activar) {
        const val = Number(porcentaje);
        if (!Number.isFinite(val) || val <= 0 || val > 100) {
          toastError("El descuento debe ser un valor entre 1 y 100");
          return;
        }
      }

      try {
        setCargando(true);
        setCargandoId(producto.idProducto);

        const datosActualizacion = {
          enOferta: activar,
          porcentajeDescuento: activar ? porcentaje : 0,
        };

        if (fechas) {
          datosActualizacion.fechaInicioOferta = fechas.fechaInicio;
          datosActualizacion.fechaFinOferta = fechas.fechaFin;
        }

        await axios.put(
          `${backendUrl}/productos/actualizar/${producto.idProducto}`,
          datosActualizacion,
          getConfig(),
        );

        toastSuccess(
          activar
            ? `¡Oferta ${porcentaje}% aplicada a ${producto.nombreProducto}!`
            : `Oferta desactivada de ${producto.nombreProducto}`,
          activar
            ? createElement(PartyPopper, { size: 16 })
            : createElement(CircleCheck, { size: 16 }),
        );

        await fetchProducts();
      } catch (error) {
        console.error("Error al actualizar oferta:", error);
        toastError(
          error.response?.data?.message || "Error al actualizar la oferta",
        );
      } finally {
        setCargando(false);
        setCargandoId(null);
      }
    },
    [estaEnCampana, backendUrl, getConfig, fetchProducts, setCargando, setCargandoId],
  );

  return {
    estaEnCampana,
    handleCambiarOferta,
  };
};
