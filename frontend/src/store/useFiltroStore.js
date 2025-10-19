import { create } from 'zustand';
import { useProductStore } from './useProductStore'; // Asegúrate que la ruta sea correcta

export const useFiltroStore = create((set, get) => ({
    // 1. ESTADO DE LOS FILTROS
    filtroCategoria: "todos",
    busqueda: "",
    ordenPrecio: "defecto",

    // 2. ACCIONES PARA MODIFICAR LOS FILTROS
    setFiltroCategoria: (categoria) => set({ filtroCategoria: categoria }),
    setBusqueda: (termino) => set({ busqueda: termino }),
    setOrdenPrecio: (orden) => set({ ordenPrecio: orden }),
    limpiarFiltros: () => set({
        filtroCategoria: "todos",
        busqueda: "",
        ordenPrecio: "defecto"
    }),

    // 3. SELECTOR PARA OBTENER LOS PRODUCTOS YA FILTRADOS
    getProductosFiltrados: () => {
        // Obtiene el estado MÁS RECIENTE de los otros stores
        const { productos } = useProductStore.getState();
        const { filtroCategoria, busqueda, ordenPrecio } = get();

        // Aplica la lógica de filtrado y ordenamiento
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