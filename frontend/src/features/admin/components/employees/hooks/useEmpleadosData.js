import { useState, useEffect } from "react";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";

/**
 * Hook personalizado para gestionar todos los datos y operaciones de empleados
 * Centraliza la lógica de API, permisos y manejo de estado
 */
export const useEmpleadosData = () => {
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);

  /**
   * Obtiene todos los empleados (activos + inactivos) del backend
   * Combina dos endpoints para tener una vista unificada
   */
  const fetchEmpleados = async () => {
    setCargando(true);
    try {
      // Obtener empleados activos
      const resActivos = await apiClient.get("/empleados");
      let activos = [];
      if (resActivos.data.results && Array.isArray(resActivos.data.results)) {
        activos = resActivos.data.results;
      } else if (Array.isArray(resActivos.data)) {
        activos = resActivos.data;
      }

      // Obtener empleados inactivos
      let inactivos = [];
      try {
        const resBajados = await apiClient.get("/Empleados/Bajados");
        if (Array.isArray(resBajados.data)) {
          inactivos = resBajados.data;
        }
      } catch {
        // Si no hay empleados bajados, no es un error crítico
        console.log("No hay empleados inactivos o error al obtenerlos");
      }

      // Combinar ambos arrays
      setEmpleados([...activos, ...inactivos]);
    } catch (error) {
      console.error("Error al obtener empleados", error);
      toast.error("❌ No se pudieron cargar los empleados");
      setEmpleados([]);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Carga inicial de empleados
   */
  useEffect(() => {
    fetchEmpleados();
  }, []);

  /**
   * Crea un nuevo empleado con sus permisos
   * @param {Object} datosEmpleado - Datos del empleado y permisos
   * @returns {Promise<boolean>} - true si se creó correctamente
   */
  const crearEmpleado = async (datosEmpleado) => {
    try {
      await apiClient.post("/empleados/crear", datosEmpleado);
      toast.success("🎉 Empleado y permisos registrados correctamente");
      await fetchEmpleados();
      return true;
    } catch (error) {
      console.error("Error al crear empleado:", error);
      const mensaje =
        error.response?.data?.error || "No se pudo crear el empleado";
      toast.error(`❌ ${mensaje}`);
      return false;
    }
  };

  /**
   * Actualiza los datos y permisos de un empleado existente
   * @param {number} idEmpleado - ID del empleado a actualizar
   * @param {Object} datosActualizados - Nuevos datos del empleado y permisos
   * @returns {Promise<boolean>} - true si se actualizó correctamente
   */
  const actualizarEmpleado = async (idEmpleado, datosActualizados) => {
    try {
      await apiClient.put(
        `/empleados/actualizar/${idEmpleado}`,
        datosActualizados,
      );
      toast.success("✅ Datos y permisos actualizados correctamente");
      await fetchEmpleados();
      return true;
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      toast.error("❌ No se pudo actualizar el empleado");
      return false;
    }
  };

  /**
   * Cambia el estado de un empleado (activar/desactivar)
   * @param {number} idEmpleado - ID del empleado
   * @param {boolean} esActivo - Estado actual del empleado
   * @returns {Promise<boolean>} - true si cambió correctamente
   */
  const cambiarEstadoEmpleado = async (idEmpleado, esActivo) => {
    try {
      const endpoint = esActivo
        ? `/empleados/baja/${idEmpleado}`
        : `/empleados/reactivar/${idEmpleado}`;

      await apiClient.put(endpoint);

      const mensaje = esActivo
        ? "🔴 Empleado dado de baja correctamente"
        : "🟢 Empleado reactivado correctamente";

      toast.success(mensaje);
      await fetchEmpleados();
      return true;
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("❌ No se pudo cambiar el estado del empleado");
      return false;
    }
  };

  /**
   * Calcula estadísticas de empleados y permisos
   */
  const estadisticas = {
    total: empleados.length,
    activos: empleados.filter((e) => e.activo !== 0 && e.activo !== false)
      .length,
    inactivos: empleados.filter((e) => e.activo === 0 || e.activo === false)
      .length,
    conPermisoCrear: empleados.filter(
      (e) =>
        (e.crear_productos === 1 || e.crear_productos === true) &&
        e.activo !== 0 &&
        e.activo !== false,
    ).length,
  };

  return {
    empleados,
    cargando,
    estadisticas,
    fetchEmpleados,
    crearEmpleado,
    actualizarEmpleado,
    cambiarEstadoEmpleado,
  };
};
