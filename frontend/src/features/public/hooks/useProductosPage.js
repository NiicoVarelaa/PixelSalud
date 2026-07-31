import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProductStore } from "@store/useProductStore";
import { useFiltroStore, getProductosFiltrados } from "@store/useFiltroStore";

const HIDDEN_PUBLIC_CATEGORY = "Medicamentos con Receta";
const HOME_CAMPAIGN_NAME =
  import.meta.env.VITE_HOME_CAMPAIGN_NAME || "Otoño 2026";

export const useProductosPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { productos, campanasInicio, productosCyberMonday, fetchProducts, isLoading } =
    useProductStore();
  const {
    filtroCategoria,
    busqueda,
    ordenPrecio,
    setFiltroCategoria,
    setBusqueda,
    setOrdenPrecio,
  } = useFiltroStore();

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;

  useEffect(() => {
    if (productos.length === 0 || campanasInicio.length === 0) fetchProducts();
  }, [productos.length, campanasInicio.length, fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoriaParam = params.get("categoria") ?? "todos";
    const categoriaNormalizada =
      categoriaParam === HIDDEN_PUBLIC_CATEGORY ? "todos" : categoriaParam;

    if (categoriaParam === HIDDEN_PUBLIC_CATEGORY) {
      params.delete("categoria");
      navigate({ search: params.toString() }, { replace: true });
    }

    setFiltroCategoria(categoriaNormalizada);
    setBusqueda(params.get("busqueda") ?? "");
    setOrdenPrecio(params.get("orden") ?? "defecto");
    setPaginaActual(parseInt(params.get("pagina")) || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const productosBase = useMemo(
    () =>
      getProductosFiltrados({
        productos,
        productosCyberMonday,
        campanasInicio,
        filtroCategoria,
        busqueda,
        ordenPrecio,
      }),
    [productos, productosCyberMonday, campanasInicio, filtroCategoria, busqueda, ordenPrecio],
  );

  const productosPaginados = useMemo(() => {
    const indiceInicio = (paginaActual - 1) * productosPorPagina;
    const indiceFin = indiceInicio + productosPorPagina;
    return productosBase.slice(indiceInicio, indiceFin);
  }, [productosBase, paginaActual, productosPorPagina]);

  const normalizeText = (value = "") =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const campanaActiva = useMemo(() => {
    if (!Array.isArray(campanasInicio)) return null;

    return (
      campanasInicio.find(
        (campana) =>
          normalizeText(campana?.nombreCampana) ===
          normalizeText(filtroCategoria),
      ) || null
    );
  }, [campanasInicio, filtroCategoria]);

  const campanaDestacada = useMemo(() => {
    if (!Array.isArray(campanasInicio) || campanasInicio.length === 0) {
      return null;
    }

    const target = normalizeText(HOME_CAMPAIGN_NAME);

    return (
      campanasInicio.find((campana) => {
        const currentName = normalizeText(campana?.nombreCampana);
        return currentName === target || currentName.includes(target);
      }) || null
    );
  }, [campanasInicio]);

  const totalPaginas = Math.ceil(productosBase.length / productosPorPagina);

  const updateParams = useCallback(
    (key, value, resetPage = false) => {
      const params = new URLSearchParams(location.search);

      const sanitizedValue =
        key === "categoria" && value === HIDDEN_PUBLIC_CATEGORY
          ? "todos"
          : value;

      if (
        !sanitizedValue ||
        sanitizedValue === "todos" ||
        sanitizedValue === "defecto" ||
        (key === "pagina" && sanitizedValue === 1)
      ) {
        params.delete(key);
      } else {
        params.set(key, sanitizedValue);
      }
      if (resetPage) params.delete("pagina");

      navigate({ search: params.toString() }, { replace: true });
    },
    [location.search, navigate],
  );

  return {
    busqueda,
    campanaActiva,
    campanaDestacada,
    filtroCategoria,
    isLoading,
    ordenPrecio,
    paginaActual,
    productosPaginados,
    totalPaginas,
    totalProductos: productosBase.length,
    updateParams,
  };
};
