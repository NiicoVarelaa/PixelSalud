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

export const useClientesData = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);

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
        toastError("Error al cargar lista de clientes");
      }
      setClientes([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const crearCliente = async (datosCliente) => {
    try {
      await apiClient.post("/clientes/crear", datosCliente);
      toastSuccess(
        "Cliente registrado correctamente",
        createElement(UserPlus, { size: 16 }),
      );
      await fetchClientes();
      return true;
    } catch (error) {
      console.error("Error al crear cliente:", error);
      const mensaje =
        error.response?.data?.error || "No se pudo crear el cliente";
      toastError(mensaje);
      return false;
    }
  };

  const actualizarCliente = async (idCliente, datosActualizados) => {
    try {
      await apiClient.put(
        `/clientes/actualizar/${idCliente}`,
        datosActualizados,
      );
      toastSuccess(
        "Cliente actualizado correctamente",
        createElement(CircleCheck, { size: 16 }),
      );
      await fetchClientes();
      return true;
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toastError("No se pudo actualizar el cliente");
      return false;
    }
  };

  const cambiarEstadoCliente = async (idCliente, esActivo) => {
    try {
      const endpoint = esActivo
        ? `/clientes/darBaja/${idCliente}`
        : `/clientes/activar/${idCliente}`;

      await apiClient.put(endpoint);

      if (esActivo) {
        toastSuccess(
          "Cliente dado de baja correctamente",
          createElement(UserX, { size: 16 }),
        );
      } else {
        toastSuccess(
          "Cliente reactivado correctamente",
          createElement(UserCheck, { size: 16 }),
        );
      }

      await fetchClientes();
      return true;
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toastError("No se pudo cambiar el estado del cliente");
      return false;
    }
  };

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
    actualizarCliente,
    crearCliente,
    cambiarEstadoCliente,
    fetchClientes,
  };
};
