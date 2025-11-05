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
    console.log(`[STORE] Iniciando búsqueda para el producto ID: ${id}`);

    try {
      console.log("[STORE] Pidiendo producto principal a la API...");
      const res = await axios.get(`${API_URL}/${id}`);
      const productoData = res.data;
      console.log("DEBUG - Datos del producto desde API:", productoData);
      console.log("DEBUG - precioRegular:", productoData.precioRegular);
      console.log("DEBUG - precioFinal:", productoData.precioFinal);
      console.log("DEBUG - enOferta:", productoData.enOferta);

      // CORRECCIÓN: Usar los campos correctos de la API
      // La API devuelve: precioRegular y precioFinal
      const precioActual = cleanAndParsePrice(
        productoData.precioFinal || productoData.precio
      );
      const precioRegular = cleanAndParsePrice(productoData.precioRegular);

      // Determinar si hay oferta activa
      const tieneOferta = productoData.enOferta && precioActual < precioRegular;

      let allProducts = useProductStore.getState().productos;
      if (allProducts.length === 0) {
        console.log(
          "[STORE] Lista de productos vacía, buscando todos los productos..."
        );
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
      console.log(
        "[STORE] Productos relacionados encontrados:",
        related.length
      );

      // Actualizar estado con los precios correctos
      set({
        producto: {
          ...productoData,
          precio: precioActual, // Usar el precio final (con descuento si aplica)
        },
        relatedProducts: related,
        precioOriginal: tieneOferta ? precioRegular : null, // Solo mostrar original si hay descuento
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
