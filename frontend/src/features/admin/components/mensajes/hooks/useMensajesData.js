import { useState, useCallback } from "react";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const useMensajesData = () => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMensajes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/mensajes");
      setMensajes(res.data);
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
      setError("Error al cargar mensajes");
      toast.error("Error al cargar mensajes");
      setMensajes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const marcarLeido = useCallback(
    async (idMensaje) => {
      try {
        await apiClient.patch(`/mensajes/${idMensaje}/leido`);
        toast.success("Mensaje marcado como leído");
        fetchMensajes();
      } catch (error) {
        console.error("Error al marcar como leído:", error);
        toast.error("Error al marcar como leído");
      }
    },
    [fetchMensajes],
  );

  const cambiarEstado = useCallback(
    async (idMensaje, nuevoEstado) => {
      try {
        await apiClient.put(`/mensajes/${idMensaje}/estado`, {
          estado: nuevoEstado,
        });
        toast.success("Estado actualizado correctamente");
        fetchMensajes();
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        toast.error("Error al cambiar estado");
      }
    },
    [fetchMensajes],
  );

  const eliminarMensaje = useCallback(
    async (idMensaje) => {
      const result = await Swal.fire({
        title: "¿Eliminar mensaje?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        try {
          await apiClient.delete(`/mensajes/${idMensaje}`);
          toast.success("Mensaje eliminado correctamente");
          fetchMensajes();
          return true;
        } catch (error) {
          console.error("Error al eliminar mensaje:", error);
          toast.error("Error al eliminar mensaje");
          return false;
        }
      }
      return false;
    },
    [fetchMensajes],
  );

  const enviarRespuesta = useCallback(
    async (idMensaje, respuesta) => {
      if (!respuesta.trim()) {
        toast.warning("La respuesta no puede estar vacía");
        return false;
      }

      try {
        await apiClient.post(`/mensajes/${idMensaje}/responder`, {
          respuesta: respuesta.trim(),
        });
        toast.success("Respuesta enviada correctamente");
        fetchMensajes();
        return true;
      } catch (error) {
        console.error("Error al responder:", error);
        toast.error("Error al enviar respuesta");
        return false;
      }
    },
    [fetchMensajes],
  );

  return {
    mensajes,
    loading,
    error,
    fetchMensajes,
    marcarLeido,
    cambiarEstado,
    eliminarMensaje,
    enviarRespuesta,
  };
};
