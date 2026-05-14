import { create } from "zustand";
import apiClient from "@utils/apiClient";
import { useProductStore } from "./useProductStore";
import { cleanAndParsePrice } from "@utils/priceUtils";

export const useProductDetailStore = create((set) => ({
  producto: null,
  relatedProducts: [],
  precioOriginal: null,
  isLoading: true,
  error: null,

  fetchProductDetail: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const res = await apiClient.get(`/productos/${id}`);
      const productoData = res.data;
      const precioActual = cleanAndParsePrice(
        productoData.precioFinal || productoData.precio,
      );
      const precioRegular = cleanAndParsePrice(productoData.precioRegular);

      const tieneOferta = productoData.enOferta && precioActual < precioRegular;

      let allProducts = useProductStore.getState().productos;
      if (allProducts.length === 0) {
        await useProductStore.getState().fetchProducts();
        allProducts = useProductStore.getState().productos;
      }

      const related = allProducts
        .filter(
          (p) =>
            p.categoria === productoData.categoria &&
            p.idProducto !== productoData.idProducto,
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);
      set({
        producto: {
          ...productoData,
          precio: precioActual,
        },
        relatedProducts: related,
        precioOriginal: tieneOferta ? precioRegular : null,
        isLoading: false,
      });
    } catch (err) {
      console.error("[STORE] Error detallado al buscar el producto:", err);
      set({
        error: "No se pudo cargar la información del producto.",
        isLoading: false,
      });
    }
  },
}));
