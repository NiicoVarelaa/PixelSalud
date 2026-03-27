import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProductStore } from "@store/useProductStore";
import { useFiltroStore } from "@store/useFiltroStore";

export const useProductosPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { productos, fetchProducts, isLoading } = useProductStore();
  const { 
    filtroCategoria, busqueda, ordenPrecio, 
    setFiltroCategoria, setBusqueda, setOrdenPrecio, getProductosFiltrados 
  } = useFiltroStore();

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12; 

  useEffect(() => {
    if (productos.length === 0) fetchProducts();
  }, [productos.length, fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFiltroCategoria(params.get("categoria") ?? "todos");
    setBusqueda(params.get("busqueda") ?? "");
    setOrdenPrecio(params.get("orden") ?? "defecto");
    setPaginaActual(parseInt(params.get("pagina")) || 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const productosBase = getProductosFiltrados();
  
  const productosPaginados = useMemo(() => {
    const indiceInicio = (paginaActual - 1) * productosPorPagina;
    const indiceFin = indiceInicio + productosPorPagina;
    return productosBase.slice(indiceInicio, indiceFin);
  }, [productosBase, paginaActual, productosPorPagina]);

  const totalPaginas = Math.ceil(productosBase.length / productosPorPagina);

  const updateParams = useCallback((key, value, resetPage = false) => {
    const params = new URLSearchParams(location.search);
    if (!value || value === "todos" || value === "defecto" || (key === "pagina" && value === 1)) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    if (resetPage) params.delete("pagina");
    
    navigate({ search: params.toString() }, { replace: true });
  }, [location.search, navigate]);

  return {
    isLoading,
    productosPaginados,
    totalProductos: productosBase.length,
    paginaActual,
    totalPaginas,
    updateParams,
    filtroCategoria, busqueda, ordenPrecio
  };
};