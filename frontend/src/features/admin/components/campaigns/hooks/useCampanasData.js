import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "@store/useAuthStore";
import { useProductStore } from "@store/useProductStore";

export const useCampanasData = () => {
  const [campanas, setCampanas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { fetchProducts } = useProductStore();
  const token = useAuthStore((state) => state.token);

  const backendUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const getConfig = useCallback(
    () => ({
      headers: { Auth: `Bearer ${token}` },
    }),
    [token],
  );

  const fetchCampanas = useCallback(async () => {
    setCargando(true);
    try {
      await fetchProducts();
      const response = await axios.get(`${backendUrl}/campanas`, getConfig());
      setCampanas(response.data);
    } catch (error) {
      console.error("Error al cargar campañas:", error);
      toast.error("Error al cargar las campañas.");
    } finally {
      setCargando(false);
    }
  }, [backendUrl, getConfig, fetchProducts]);

  const cargarIdsProductosEnCampanas = useCallback(
    async ({ excluirCampanaId = null } = {}) => {
      try {
        const responseCampanas = await axios.get(
          `${backendUrl}/campanas`,
          getConfig(),
        );
        const campanasData = responseCampanas.data || [];

        const campanasFiltradas = campanasData.filter(
          (campana) => campana.idCampana !== excluirCampanaId,
        );

        if (campanasFiltradas.length === 0) return [];

        const productosPorCampana = await Promise.all(
          campanasFiltradas.map((campana) =>
            axios.get(
              `${backendUrl}/campanas/${campana.idCampana}/productos`,
              getConfig(),
            ),
          ),
        );

        const ids = new Set();
        productosPorCampana.forEach((res) => {
          res.data?.productos?.forEach((producto) =>
            ids.add(producto.idProducto),
          );
        });

        return Array.from(ids);
      } catch (error) {
        console.error("Error al cargar productos en campañas:", error);
        toast.error(
          "No se pudieron cargar los productos ya asignados a campañas.",
        );
        return [];
      }
    },
    [backendUrl, getConfig],
  );

  const limpiarOfertasIndividuales = useCallback(
    async (productosIds) => {
      if (!Array.isArray(productosIds) || productosIds.length === 0) return;

      await Promise.all(
        productosIds.map((idProducto) =>
          axios.put(
            `${backendUrl}/productos/actualizar/${idProducto}`,
            { enOferta: false, porcentajeDescuento: 0 },
            getConfig(),
          ),
        ),
      );
    },
    [backendUrl, getConfig],
  );

  const crearCampana = useCallback(
    async (nuevaCampana, productosSeleccionados) => {
      try {
        const esDosPorUno = nuevaCampana.tipo === "2X1";

        if (
          !nuevaCampana.nombreCampana ||
          (!esDosPorUno && !nuevaCampana.porcentajeDescuento)
        ) {
          toast.error("Complete los campos obligatorios");
          return false;
        }

        if (productosSeleccionados.length === 0) {
          toast.error("Seleccione al menos un producto");
          return false;
        }

        const responseCampana = await axios.post(
          `${backendUrl}/campanas`,
          {
            nombreCampana: nuevaCampana.nombreCampana,
            descripcion: nuevaCampana.descripcion,
            porcentajeDescuento: esDosPorUno
              ? 0
              : parseFloat(nuevaCampana.porcentajeDescuento),
            fechaInicio: nuevaCampana.fechaInicio,
            fechaFin: nuevaCampana.fechaFin,
            tipo: nuevaCampana.tipo,
            esActiva: true,
          },
          getConfig(),
        );

        const idCampana = responseCampana.data.idCampana;

        await limpiarOfertasIndividuales(productosSeleccionados);

        await axios.post(
          `${backendUrl}/campanas/${idCampana}/productos`,
          { productosIds: productosSeleccionados },
          getConfig(),
        );

        toast.success(
          `¡Campaña "${nuevaCampana.nombreCampana}" creada con ${productosSeleccionados.length} productos!`,
          { icon: "🎉" },
        );

        await fetchCampanas();
        return true;
      } catch (error) {
        console.error("Error al crear campaña:", error);
        toast.error(
          error.response?.data?.message || "Error al crear la campaña",
          { icon: "❌" },
        );
        return false;
      }
    },
    [backendUrl, getConfig, fetchCampanas, limpiarOfertasIndividuales],
  );

  const actualizarCampana = useCallback(
    async (campanaEditando, nuevaCampana, productosSeleccionados) => {
      try {
        const esDosPorUno = nuevaCampana.tipo === "2X1";

        await axios.put(
          `${backendUrl}/campanas/${campanaEditando.idCampana}`,
          {
            nombreCampana: nuevaCampana.nombreCampana,
            descripcion: nuevaCampana.descripcion,
            porcentajeDescuento: esDosPorUno
              ? 0
              : parseFloat(nuevaCampana.porcentajeDescuento),
            fechaInicio: nuevaCampana.fechaInicio,
            fechaFin: nuevaCampana.fechaFin,
            tipo: nuevaCampana.tipo,
          },
          getConfig(),
        );

        const responseProductos = await axios.get(
          `${backendUrl}/campanas/${campanaEditando.idCampana}/productos`,
          getConfig(),
        );
        const productosActuales = responseProductos.data.productos
          ? responseProductos.data.productos.map((p) => p.idProducto)
          : [];

        const productosParaAgregar = productosSeleccionados.filter(
          (id) => !productosActuales.includes(id),
        );
        const productosParaEliminar = productosActuales.filter(
          (id) => !productosSeleccionados.includes(id),
        );

        if (productosParaAgregar.length > 0) {
          await limpiarOfertasIndividuales(productosParaAgregar);
        }

        if (productosParaAgregar.length > 0) {
          await axios.post(
            `${backendUrl}/campanas/${campanaEditando.idCampana}/productos`,
            { productosIds: productosParaAgregar },
            getConfig(),
          );
        }

        if (productosParaEliminar.length > 0) {
          await axios.delete(
            `${backendUrl}/campanas/${campanaEditando.idCampana}/productos`,
            {
              ...getConfig(),
              data: { productosIds: productosParaEliminar },
            },
          );
        }

        toast.success("¡Campaña actualizada correctamente!", { icon: "✅" });
        await fetchCampanas();
        return true;
      } catch (error) {
        console.error("Error al actualizar campaña:", error);
        toast.error("Error al actualizar la campaña", { icon: "❌" });
        return false;
      }
    },
    [backendUrl, getConfig, fetchCampanas, limpiarOfertasIndividuales],
  );

  const toggleActiva = useCallback(
    async (idCampana, esActiva) => {
      try {
        await axios.put(
          `${backendUrl}/campanas/${idCampana}`,
          { esActiva: !esActiva },
          getConfig(),
        );

        toast.success(
          `Campaña ${esActiva ? "desactivada" : "activada"} correctamente`,
          { icon: esActiva ? "🔴" : "🟢" },
        );
        await fetchCampanas();
        return true;
      } catch {
        toast.error("No se pudo cambiar el estado", { icon: "❌" });
        return false;
      }
    },
    [backendUrl, getConfig, fetchCampanas],
  );

  const eliminarCampana = useCallback(
    async (idCampana) => {
      try {
        await axios.delete(`${backendUrl}/campanas/${idCampana}`, getConfig());
        toast.success("¡Campaña eliminada correctamente!", { icon: "🗑️" });
        await fetchCampanas();
        return true;
      } catch {
        toast.error("No se pudo eliminar la campaña", { icon: "❌" });
        return false;
      }
    },
    [backendUrl, getConfig, fetchCampanas],
  );

  const cargarProductosCampana = useCallback(
    async (idCampana) => {
      try {
        const response = await axios.get(
          `${backendUrl}/campanas/${idCampana}/productos`,
          getConfig(),
        );
        return response.data.productos
          ? response.data.productos.map((p) => p.idProducto)
          : [];
      } catch (error) {
        console.error("Error al cargar productos:", error);
        toast.error("Error al cargar los datos de la campaña", { icon: "❌" });
        return [];
      }
    },
    [backendUrl, getConfig],
  );

  return {
    campanas,
    cargando,
    fetchCampanas,
    crearCampana,
    actualizarCampana,
    toggleActiva,
    eliminarCampana,
    cargarProductosCampana,
    cargarIdsProductosEnCampanas,
  };
};
