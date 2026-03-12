import { useState, useEffect, useCallback } from "react";
import apiClient from "@utils/apiClient";

export const useProductSearch = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    if (terminoBusqueda.length < 3) {
      setResultadosBusqueda([]);
      return;
    }
    const timer = setTimeout(() => buscarProductos(terminoBusqueda), 300);
    return () => clearTimeout(timer);
  }, [terminoBusqueda]);

  const buscarProductos = async (term) => {
    try {
      const response = await apiClient.get("/productos/buscar", {
        params: { term },
      });
      if (Array.isArray(response.data)) {
        setResultadosBusqueda(response.data);
      } else {
        setResultadosBusqueda([]);
      }
    } catch (error) {
      console.error(error);
      setResultadosBusqueda([]);
    }
  };

  const seleccionarProducto = useCallback((prod) => {
    setProductoSeleccionado(prod);
    setResultadosBusqueda([]);
    setTerminoBusqueda("");
  }, []);

  const limpiarSeleccion = useCallback(() => {
    setProductoSeleccionado(null);
    setTerminoBusqueda("");
    setResultadosBusqueda([]);
  }, []);

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    resultadosBusqueda,
    productoSeleccionado,
    seleccionarProducto,
    limpiarSeleccion,
  };
};
