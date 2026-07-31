import { useState, useEffect, useCallback, useMemo } from "react";
import apiClient from "@utils/apiClient";

export const useProductSearch = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [productosCatalogo, setProductosCatalogo] = useState([]);
  const [resultadosBase, setResultadosBase] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const normalizarTexto = useCallback((value) => {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }, []);

  const resultadosBusqueda = useMemo(() => {
    if (filtroCategoria === "todas") {
      return resultadosBase;
    }

    const categoriaFiltroNormalizada = normalizarTexto(filtroCategoria);

    return resultadosBase.filter(
      (producto) =>
        normalizarTexto(producto.categoria) === categoriaFiltroNormalizada,
    );
  }, [filtroCategoria, normalizarTexto, resultadosBase]);

  const productosCategoria = useMemo(() => {
    if (filtroCategoria === "todas") {
      return [];
    }

    const categoriaFiltroNormalizada = normalizarTexto(filtroCategoria);
    const terminoNormalizado = normalizarTexto(terminoBusqueda);

    const productosFiltrados = productosCatalogo.filter((producto) => {
      const coincideCategoria =
        normalizarTexto(producto.categoria) === categoriaFiltroNormalizada;

      if (!coincideCategoria) return false;
      if (!terminoNormalizado) return true;

      const nombreNormalizado = normalizarTexto(producto.nombreProducto);
      const idNormalizado = normalizarTexto(producto.idProducto);

      return (
        nombreNormalizado.includes(terminoNormalizado) ||
        idNormalizado.includes(terminoNormalizado)
      );
    });

    return productosFiltrados.sort((a, b) =>
      String(a.nombreProducto || "").localeCompare(
        String(b.nombreProducto || ""),
      ),
    );
  }, [filtroCategoria, normalizarTexto, productosCatalogo, terminoBusqueda]);

  const cargarCategorias = useCallback(async () => {
    try {
      const response = await apiClient.get("/productos");
      const productos = Array.isArray(response.data) ? response.data : [];

      const categoriasUnicas = [...new Set(productos.map((p) => p.categoria))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

      setCategoriasDisponibles(categoriasUnicas);
      setProductosCatalogo(productos);
    } catch (error) {
      console.error(error);
      setCategoriasDisponibles([]);
      setProductosCatalogo([]);
    }
  }, []);

  const buscarProductos = useCallback(async (term) => {
    try {
      const response = await apiClient.get("/productos/buscar", {
        params: { term },
      });

      if (Array.isArray(response.data)) {
        setResultadosBase(response.data);
      } else {
        setResultadosBase([]);
      }
    } catch (error) {
      console.error(error);
      setResultadosBase([]);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  useEffect(() => {
    if (terminoBusqueda.length < 3) {
      setResultadosBase([]);
      return;
    }

    const timer = setTimeout(() => buscarProductos(terminoBusqueda), 300);
    return () => clearTimeout(timer);
  }, [buscarProductos, terminoBusqueda]);

  const seleccionarProducto = useCallback((prod) => {
    setProductoSeleccionado(prod);
    setResultadosBase([]);
    setTerminoBusqueda("");
  }, []);

  const limpiarSeleccion = useCallback(() => {
    setProductoSeleccionado(null);
    setTerminoBusqueda("");
    setResultadosBase([]);
  }, []);

  return {
    categoriasDisponibles,
    filtroCategoria,
    productoSeleccionado,
    productosCategoria,
    resultadosBusqueda,
    terminoBusqueda,
    limpiarSeleccion,
    seleccionarProducto,
    setTerminoBusqueda,
    setFiltroCategoria,
  };
};
