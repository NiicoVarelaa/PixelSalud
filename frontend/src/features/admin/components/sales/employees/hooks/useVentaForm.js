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
    case "ADD_PRODUCT": {
      const indexExistente = state.productos.findIndex(
        (prod) => prod.idProducto === action.product.idProducto,
      );

      if (indexExistente === -1) {
        return { ...state, productos: [...state.productos, action.product] };
      }

      const productosActualizados = state.productos.map((prod, index) => {
        if (index !== indexExistente) return prod;

        const cantidadNueva =
          Number(prod.cantidad || 0) + Number(action.product.cantidad || 0);

        return {
          ...prod,
          cantidad: cantidadNueva,
          precioUnitario: action.product.precioUnitario,
        };
      });

      return {
        ...state,
        productos: productosActualizados,
      };
    }
    case "UPDATE_PRODUCT":
      return {
        ...state,
        productos: state.productos.map((prod, index) =>
          index === action.index
            ? { ...prod, [action.field]: action.value }
            : prod,
        ),
      };
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

  const getIdEmpleadoFromUser = useCallback(() => {
    return user?.idEmpleado || user?.id || "";
  }, [user]);

  // Auto-detectar usuario para nuevas ventas
  useEffect(() => {
    if (!isEditingState) {
      const idEmpleadoActual = getIdEmpleadoFromUser();
      if (idEmpleadoActual) {
        dispatch({
          type: "SET_FIELD",
          field: "idEmpleado",
          value: idEmpleadoActual,
        });
      }
    }
  }, [getIdEmpleadoFromUser, isEditingState]);

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
    const idEmpleadoFinal = ventaForm.idEmpleado || getIdEmpleadoFromUser();

    if (ventaForm.productos.length === 0) {
      toast.error("El ticket está vacío. Agrega al menos un producto.");
      return false;
    }

    if (!idEmpleadoFinal) {
      toast.error("No se pudo identificar el empleado de la venta.");
      return false;
    }

    const payload = {
      ...ventaForm,
      idEmpleado: idEmpleadoFinal,
    };

    try {
      if (isEditingState) {
        await apiClient.put(
          `/ventasEmpleados/actualizar/${editingId}`,
          payload,
        );
        toast.success("Venta actualizada correctamente.");
      } else {
        await apiClient.post("/ventasEmpleados/crear", payload);
        toast.success("Venta registrada con éxito.");
      }
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al procesar la venta.");
      return false;
    }
  }, [ventaForm, getIdEmpleadoFromUser, isEditingState, editingId, onSuccess]);

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
