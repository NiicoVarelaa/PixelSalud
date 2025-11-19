import { create } from 'zustand';
import { useProductStore } from './useProductStore';

export const useFiltroStore = create((set, get) => ({
    filtroCategoria: "todos",
    busqueda: "",
    ordenPrecio: "defecto",

    setFiltroCategoria: (categoria) => set({ filtroCategoria: categoria }),
    setBusqueda: (termino) => set({ busqueda: termino }),
    setOrdenPrecio: (orden) => set({ ordenPrecio: orden }),
    limpiarFiltros: () => set({
        filtroCategoria: "todos",
        busqueda: "",
        ordenPrecio: "defecto"
    }),

    getProductosFiltrados: () => {
        const { productos } = useProductStore.getState();
        const { filtroCategoria, busqueda, ordenPrecio } = get();

        const productosFiltrados = productos
            .filter((p) => {
                const coincideCategoria = filtroCategoria === "todos" || p.categoria === filtroCategoria;
                const coincideNombre = p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());
                return coincideCategoria && coincideNombre;
            })
            .sort((a, b) => {
                if (ordenPrecio === "menor-precio") return a.precio - b.precio;
                if (ordenPrecio === "mayor-precio") return b.precio - a.precio;
                return 0;
            });
        return productosFiltrados;
    }
}));