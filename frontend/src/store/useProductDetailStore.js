import { create } from 'zustand';
import axios from 'axios';
import { useProductStore } from './useProductStore';

const API_URL = "http://localhost:5000/productos";

export const useProductDetailStore = create((set) => ({
  // Estado inicial
  producto: null,
  relatedProducts: [],
  precioOriginal: null,
  isLoading: true,
  error: null,

  // Acción corregida y reorganizada
  fetchProductDetail: async (id) => {
    // 1. Inicia el estado de carga.
    set({ isLoading: true, error: null });
    console.log(`[STORE] Iniciando búsqueda para el producto ID: ${id}`);

    try {
      // 2. BUSCA EL PRODUCTO PRINCIPAL PRIMERO. Esto es lo más importante.
      console.log("[STORE] Pidiendo producto principal a la API...");
      const res = await axios.get(`${API_URL}/${id}`);
      const productoData = res.data;
      console.log("[STORE] ¡Producto principal recibido!", productoData);

      // 3. Una vez que tienes el producto, busca los relacionados.
      let allProducts = useProductStore.getState().productos;
      if (allProducts.length === 0) {
        console.log("[STORE] Lista de productos vacía, buscando todos los productos...");
        await useProductStore.getState().fetchProducts();
        allProducts = useProductStore.getState().productos;
      }

      const related = allProducts
        .filter(p => p.categoria === productoData.categoria && p.idProducto !== productoData.idProducto)
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);
      console.log("[STORE] Productos relacionados encontrados:", related.length);

      // 4. Calcula el precio original (si aplica).
      const discountPercentage = 0.20;
      const precioOriginalCalculado = productoData.precio / (1 - discountPercentage);

      // 5. Actualiza el estado con TODOS los datos y finaliza la carga.
      set({
        producto: productoData,
        relatedProducts: related,
        precioOriginal: precioOriginalCalculado,
        isLoading: false,
      });

    } catch (err) {
      // Si algo falla en CUALQUIER paso, captura el error y finaliza la carga.
      console.error("[STORE] Error detallado al buscar el producto:", err);
      set({
        error: "No se pudo cargar la información del producto.",
        isLoading: false,
      });
    }
  },
}));