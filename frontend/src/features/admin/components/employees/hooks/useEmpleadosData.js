import { useState, useEffect, createElement } from "react";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";
import { CircleX, CircleCheck, UserPlus, UserX, UserCheck } from "lucide-react";

const toastError = (message) =>
  toast.error(message, {
    icon: createElement(CircleX, { size: 16 }),
  });

const toastSuccess = (message, icon) =>
  toast.success(message, {
    icon,
  });

export const useEmpleadosData = () => {
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fetchEmpleados = async () => {
    setCargando(true);
    try {
      const resActivos = await apiClient.get("/empleados");
      let activos = [];
      if (resActivos.data.results && Array.isArray(resActivos.data.results)) {
        activos = resActivos.data.results;
      } else if (Array.isArray(resActivos.data)) {
        activos = resActivos.data;
      }

      let inactivos = [];
      try {
        const resBajados = await apiClient.get("/Empleados/Bajados");
        if (Array.isArray(resBajados.data)) {
          inactivos = resBajados.data;
        }
      } catch (error) {
        console.warn("No se pudieron cargar empleados inactivos:", error);
      }

      setEmpleados([...activos, ...inactivos]);
    } catch (error) {
      console.error("Error al obtener empleados", error);
      toastError("No se pudieron cargar los empleados");
      setEmpleados([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const crearEmpleado = async (datosEmpleado) => {
    try {
      await apiClient.post("/empleados/crear", datosEmpleado);
      toastSuccess(
        "Empleado y permisos registrados correctamente",
        createElement(UserPlus, { size: 16 }),
      );
      await fetchEmpleados();
      return true;
    } catch (error) {
      console.error("Error al crear empleado:", error);
      const mensaje =
        error.response?.data?.error || "No se pudo crear el empleado";
      toastError(mensaje);
      return false;
    }
  };

  const actualizarEmpleado = async (idEmpleado, datosActualizados) => {
    try {
      await apiClient.put(
        `/empleados/actualizar/${idEmpleado}`,
        datosActualizados,
      );
      toastSuccess(
        "Datos y permisos actualizados correctamente",
        createElement(CircleCheck, { size: 16 }),
      );
      await fetchEmpleados();
      return true;
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      toastError("No se pudo actualizar el empleado");
      return false;
    }
  };

  const cambiarEstadoEmpleado = async (idEmpleado, esActivo) => {
    try {
      const endpoint = esActivo
        ? `/empleados/baja/${idEmpleado}`
        : `/empleados/reactivar/${idEmpleado}`;

      await apiClient.put(endpoint);

      if (esActivo) {
        toastSuccess(
          "Empleado dado de baja correctamente",
          createElement(UserX, { size: 16 }),
        );
      } else {
        toastSuccess(
          "Empleado reactivado correctamente",
          createElement(UserCheck, { size: 16 }),
        );
      }

      await fetchEmpleados();
      return true;
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toastError("No se pudo cambiar el estado del empleado");
      return false;
    }
  };

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
    cargando,
    empleados,
    estadisticas,
    actualizarEmpleado,
    cambiarEstadoEmpleado,
    crearEmpleado,
    fetchEmpleados,
  };
};
