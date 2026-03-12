import { useReducer, useEffect, useCallback, useState, useMemo } from "react";
import { useAuthStore } from "@store/useAuthStore";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ventaReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "LOAD_SALE":
      return { ...state, ...action.payload };
    case "ADD_PRODUCT":
      return { ...state, productos: [...state.productos, action.product] };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        productos: state.productos.filter((_, index) => index !== action.index),
      };
    case "RESET":
      return action.initialState;
    default:
      return state;
  }
};

export const useVentaForm = (onSuccess) => {
  const { user } = useAuthStore();

  const initialState = useMemo(
    () => ({
      idEmpleado: "",
      totalPago: 0,
      metodoPago: "Efectivo",
      productos: [],
    }),
    [],
  );

  const [ventaForm, dispatch] = useReducer(ventaReducer, initialState);
  const [isEditingState, setIsEditingState] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [nombreVendedorOriginal, setNombreVendedorOriginal] = useState("");

  // Auto-detectar usuario para nuevas ventas
  useEffect(() => {
    if (user && !isEditingState) {
      dispatch({ type: "SET_FIELD", field: "idEmpleado", value: user.id });
    }
  }, [user, isEditingState]);

  // Calcular total automático
  useEffect(() => {
    const nuevoTotal = ventaForm.productos.reduce((acc, prod) => {
      return acc + Number(prod.cantidad) * Number(prod.precioUnitario);
    }, 0);
    if (ventaForm.totalPago !== nuevoTotal) {
      dispatch({ type: "SET_FIELD", field: "totalPago", value: nuevoTotal });
    }
  }, [ventaForm.productos, ventaForm.totalPago]);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET", initialState });
    setIsEditingState(false);
    setEditingId(null);
    setNombreVendedorOriginal("");
  }, [initialState]);

  const loadVentaForEdit = useCallback(async (venta) => {
    Swal.fire({
      title: "Cargando venta...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const resDetalles = await apiClient.get(
        `/ventasEmpleados/detalle/${venta.idVentaE}`,
      );
      const detalles = resDetalles.data;

      const resVentaRaw = await apiClient.get(
        `/ventasEmpleados/admin/detalle/${venta.idVentaE}`,
      );
      const datosReales = resVentaRaw.data;

      const productosFormateados = detalles.map((d) => ({
        idProducto: d.idProducto,
        nombreProducto: d.nombreProducto,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
      }));

      setIsEditingState(true);
      setEditingId(venta.idVentaE);
      setNombreVendedorOriginal(
        `${venta.nombreEmpleado} ${venta.apellidoEmpleado}`,
      );

      dispatch({
        type: "LOAD_SALE",
        payload: {
          idEmpleado: datosReales.idEmpleado,
          metodoPago: venta.metodoPago,
          totalPago: venta.totalPago,
          productos: productosFormateados,
        },
      });

      Swal.close();
      return true;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar la venta para editar", "error");
      return false;
    }
  }, []);

  const submitVenta = useCallback(async () => {
    if (!ventaForm.idEmpleado || ventaForm.productos.length === 0) {
      toast.error("El ticket está vacío o falta el ID del empleado.");
      return false;
    }

    try {
      if (isEditingState) {
        await apiClient.put(
          `/ventasEmpleados/actualizar/${editingId}`,
          ventaForm,
        );
        toast.success("Venta actualizada correctamente.");
      } else {
        await apiClient.post("/ventasEmpleados/crear", ventaForm);
        toast.success("Venta registrada con éxito.");
      }
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al procesar la venta.");
      return false;
    }
  }, [ventaForm, isEditingState, editingId, onSuccess]);

  return {
    ventaForm,
    dispatch,
    isEditing: isEditingState,
    editingId,
    nombreVendedorOriginal,
    resetForm,
    loadVentaForEdit,
    submitVenta,
    user,
  };
};
