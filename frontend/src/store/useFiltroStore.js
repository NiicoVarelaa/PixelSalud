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
        const { productos, productosAbajo } = useProductStore.getState();
        const { filtroCategoria, busqueda, ordenPrecio } = get();

        let productosFiltrados;
        if (filtroCategoria === "Cyber Monday") {
            productosFiltrados = productosAbajo
                .filter((p) => p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase()))
                .sort((a, b) => {
                    const precioA = Number(a.precioFinal || a.precio || a.precioRegular || 0);
                    const precioB = Number(b.precioFinal || b.precio || b.precioRegular || 0);
                    if (ordenPrecio === "menor-precio") return precioA - precioB;
                    if (ordenPrecio === "mayor-precio") return precioB - precioA;
                    return 0;
                });
        } else {
            productosFiltrados = productos
                .filter((p) => {
                    const coincideCategoria = filtroCategoria === "todos" || p.categoria === filtroCategoria;
                    const coincideNombre = p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());
                    return coincideCategoria && coincideNombre;
                })
                .sort((a, b) => {
                    // Usar el campo correcto de precio
                    const precioA = Number(a.precioFinal || a.precio || a.precioRegular || 0);
                    const precioB = Number(b.precioFinal || b.precio || b.precioRegular || 0);
                    if (ordenPrecio === "menor-precio") return precioA - precioB;
                    if (ordenPrecio === "mayor-precio") return precioB - precioA;
                    return 0;
                });
        }
        return productosFiltrados;
    }
}));