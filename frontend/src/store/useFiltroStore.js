import { create } from "zustand";
import { useProductStore } from "./useProductStore";

export const useFiltroStore = create((set, get) => ({
  filtroCategoria: "todos",
  busqueda: "",
  ordenPrecio: "defecto",

  setFiltroCategoria: (categoria) => set({ filtroCategoria: categoria }),
  setBusqueda: (termino) => set({ busqueda: termino }),
  setOrdenPrecio: (orden) => set({ ordenPrecio: orden }),
  limpiarFiltros: () =>
    set({
      filtroCategoria: "todos",
      busqueda: "",
      ordenPrecio: "defecto",
    }),

  getProductosFiltrados: () => {
    const { productos, productosAbajo, productosCyberMonday } =
      useProductStore.getState();
    const { filtroCategoria, busqueda, ordenPrecio } = get();

    const sortByPrice = (lista) =>
      [...lista].sort((a, b) => {
        const precioA = Number(
          a.precioFinal || a.precio || a.precioRegular || 0,
        );
        const precioB = Number(
          b.precioFinal || b.precio || b.precioRegular || 0,
        );

        if (ordenPrecio === "menor-precio") return precioA - precioB;
        if (ordenPrecio === "mayor-precio") return precioB - precioA;
        return 0;
      });

    const coincideBusqueda = (producto) =>
      String(producto?.nombreProducto || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const getDiscountPercentages = (producto) => {
      const descuentos = [];

      const descuentoDirecto = Number(producto?.porcentajeDescuento);
      if (Number.isFinite(descuentoDirecto) && descuentoDirecto > 0) {
        descuentos.push(descuentoDirecto);
      }

      if (Array.isArray(producto?.ofertas)) {
        producto.ofertas.forEach((offer) => {
          const value = Number(offer?.porcentajeDescuento || offer?.descuento);
          if (Number.isFinite(value) && value > 0) {
            descuentos.push(value);
          }
        });
      }

      return descuentos;
    };

    let productosFiltrados;
    if (filtroCategoria.toLowerCase().includes("cyber monday")) {
      productosFiltrados = sortByPrice(
        productosCyberMonday.filter((p) => coincideBusqueda(p)),
      );
    } else if (filtroCategoria === "Ofertas") {
      const descuentosObjetivo = new Set([10, 15, 20]);

      productosFiltrados = sortByPrice(
        productos.filter((p) => {
          const descuentos = getDiscountPercentages(p);
          const tieneDescuentoObjetivo = descuentos.some((value) =>
            descuentosObjetivo.has(Math.round(value)),
          );

          return tieneDescuentoObjetivo && coincideBusqueda(p);
        }),
      );
    } else {
      productosFiltrados = sortByPrice(
        productos.filter((p) => {
          const coincideCategoria =
            filtroCategoria === "todos" || p.categoria === filtroCategoria;

          return coincideCategoria && coincideBusqueda(p);
        }),
      );
    }
    return productosFiltrados;
  },
}));
