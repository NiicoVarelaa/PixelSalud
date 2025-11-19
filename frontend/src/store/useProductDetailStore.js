import { create } from "zustand";
import axios from "axios";
import { useProductStore } from "./useProductStore";

const API_URL = "http://localhost:5000/productos";

// Función de utilidad para parsear el precio de forma segura
const cleanAndParsePrice = (price) => {
  if (typeof price === "number") return price;
  if (typeof price !== "string") return 0;

  // Asume formato regional (ej: 1.000,00). Limpia símbolos y maneja la coma decimal.
  let cleaned = price.replace(/[^0-9,.]/g, "");

  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const useProductDetailStore = create((set) => ({
  // Estado inicial
  producto: null,
  relatedProducts: [],
  precioOriginal: null,
  isLoading: true,
  error: null,

  fetchProductDetail: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/${id}`);
      const productoData = res.data;      
      const precioActual = cleanAndParsePrice(
        productoData.precioFinal || productoData.precio
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
            p.idProducto !== productoData.idProducto
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
