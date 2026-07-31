import { useMemo } from "react";
import { useProductStore } from "../../../../../../store/useProductStore"; 

export const useCategorias = () => {
  const productos = useProductStore((state) => state.productos);

  const categorias = useMemo(() => {
    if (!productos || productos.length === 0) return [];

    const todasLasCategorias = productos.map((p) => p.categoria);

    const categoriasUnicas = [...new Set(todasLasCategorias)].filter(Boolean);

    return categoriasUnicas.sort((a, b) => a.localeCompare(b));
    
  }, [productos]);

  return {
    categorias,
    loading: !productos || productos.length === 0, 
  };
};