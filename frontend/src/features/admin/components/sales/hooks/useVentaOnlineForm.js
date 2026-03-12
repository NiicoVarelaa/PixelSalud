import { useReducer, useEffect, useCallback, useMemo, useState } from "react";
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

export const useVentaOnlineForm = (onSuccess) => {
  const initialState = useMemo(
    () => ({
      idCliente: "",
      metodoPago: "Efectivo",
      totalPago: 0,
      productos: [],
    }),
    [],
  );

  const [ventaForm, dispatch] = useReducer(ventaReducer, initialState);
  const [editingId, setEditingId] = useState(null);
  const [clienteEditando, setClienteEditando] = useState("");

  // Calcular total automático
  useEffect(() => {
    const nuevoTotal = ventaForm.productos.reduce((acc, prod) => {
      return (
        acc + (Number(prod.cantidad) || 0) * (Number(prod.precioUnitario) || 0)
      );
    }, 0);
    if (ventaForm.totalPago !== nuevoTotal) {
      dispatch({ type: "SET_FIELD", field: "totalPago", value: nuevoTotal });
    }
  }, [ventaForm.productos, ventaForm.totalPago]);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET", initialState });
    setEditingId(null);
    setClienteEditando("");
  }, [initialState]);

  const loadVentaForEdit = useCallback(async (venta) => {
    Swal.fire({ title: "Cargando...", didOpen: () => Swal.showLoading() });
    try {
      const res = await apiClient.get(
        `/ventasOnline/detalle/${venta.idVentaO}`,
      );
      const detalles = res.data;

      const productosFormateados = detalles.map((d) => ({
        idProducto: d.idProducto,
        nombreProducto: d.nombreProducto,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
      }));

      dispatch({
        type: "LOAD_SALE",
        payload: {
          idCliente: venta.idCliente,
          metodoPago: venta.metodoPago,
          totalPago: venta.totalPago,
          productos: productosFormateados,
        },
      });

      setEditingId(venta.idVentaO);
      setClienteEditando(`${venta.nombreCliente} ${venta.apellidoCliente}`);

      Swal.close();
      return true;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar la venta.", "error");
      return false;
    }
  }, []);

  const submitVenta = useCallback(async () => {
    if (ventaForm.productos.length === 0) {
      toast.error("El carrito está vacío.");
      return false;
    }
    try {
      await apiClient.put(`/ventaOnline/actualizar/${editingId}`, ventaForm);
      toast.success("Venta Online actualizada.");
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar cambios.");
      return false;
    }
  }, [ventaForm, editingId, onSuccess]);

  return {
    ventaForm,
    dispatch,
    editingId,
    clienteEditando,
    resetForm,
    loadVentaForEdit,
    submitVenta,
  };
};
