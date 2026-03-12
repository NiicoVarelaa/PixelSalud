import { useState, useEffect } from "react";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";

/**
 * Hook personalizado para gestionar todos los datos y operaciones de clientes
 * Centraliza la lógica de API y manejo de estado
 */
export const useClientesData = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  /**
   * Obtiene todos los clientes del backend
   */
  const fetchClientes = async () => {
    setCargando(true);
    try {
      const res = await apiClient.get("/clientes");
      if (Array.isArray(res.data)) {
        setClientes(res.data);
      } else {
        setClientes([]);
      }
    } catch (error) {
      console.error("Error al obtener clientes", error);
      if (error.response?.status !== 404) {
        toast.error("❌ Error al cargar lista de clientes");
      }
      setClientes([]);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Carga inicial de clientes
   */
  useEffect(() => {
    fetchClientes();
  }, []);

  /**
   * Crea un nuevo cliente
   * @param {Object} datosCliente - Datos del cliente a crear
   * @returns {Promise<boolean>} - true si se creó correctamente
   */
  const crearCliente = async (datosCliente) => {
    try {
      await apiClient.post("/clientes/crear", datosCliente);
      toast.success("🎉 Cliente registrado correctamente");
      await fetchClientes();
      return true;
    } catch (error) {
      console.error("Error al crear cliente:", error);
      const mensaje =
        error.response?.data?.error || "No se pudo crear el cliente";
      toast.error(`❌ ${mensaje}`);
      return false;
    }
  };

  /**
   * Actualiza los datos de un cliente existente
   * @param {number} idCliente - ID del cliente a actualizar
   * @param {Object} datosActualizados - Nuevos datos del cliente
   * @returns {Promise<boolean>} - true si se actualizó correctamente
   */
  const actualizarCliente = async (idCliente, datosActualizados) => {
    try {
      await apiClient.put(
        `/clientes/actualizar/${idCliente}`,
        datosActualizados,
      );
      toast.success("✅ Cliente actualizado correctamente");
      await fetchClientes();
      return true;
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toast.error("❌ No se pudo actualizar el cliente");
      return false;
    }
  };

  /**
   * Cambia el estado de un cliente (activar/desactivar)
   * @param {number} idCliente - ID del cliente
   * @param {boolean} esActivo - Estado actual del cliente
   * @returns {Promise<boolean>} - true si cambió correctamente
   */
  const cambiarEstadoCliente = async (idCliente, esActivo) => {
    try {
      const endpoint = esActivo
        ? `/clientes/darBaja/${idCliente}`
        : `/clientes/activar/${idCliente}`;

      await apiClient.put(endpoint);

      const mensaje = esActivo
        ? "🔴 Cliente dado de baja correctamente"
        : "🟢 Cliente reactivado correctamente";

      toast.success(mensaje);
      await fetchClientes();
      return true;
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("❌ No se pudo cambiar el estado del cliente");
      return false;
    }
  };

  /**
   * Calcula estadísticas de clientes
   */
  const estadisticas = {
    total: clientes.length,
    activos: clientes.filter((c) => c.activo !== 0 && c.activo !== false)
      .length,
    inactivos: clientes.filter((c) => c.activo === 0 || c.activo === false)
      .length,
  };

  return {
    clientes,
    cargando,
    estadisticas,
    fetchClientes,
    crearCliente,
    actualizarCliente,
    cambiarEstadoCliente,
  };
};
