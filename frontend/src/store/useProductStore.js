import { create } from "zustand";
import axios from "axios";

const API_URL_ALL = "http://localhost:5000/productos";
// UPDATED: Usar sistema de campañas en lugar de ofertas individuales
const API_URL_CAMPANAS_ACTIVAS = "http://localhost:5000/campanas/activas";

const PRODUCTS_PER_SECTION = 6;

export const useProductStore = create((set) => ({
  productosArriba: [],
  productosAbajo: [],
  productos: [],
  categorias: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const [resAll, resCampanas] = await Promise.all([
        axios.get(API_URL_ALL),
        axios.get(API_URL_CAMPANAS_ACTIVAS).catch(() => ({ data: [] })), // Campañas opcionales
      ]);

      const todos = resAll.data;
      const campanasActivas = resCampanas.data || [];

      const productosDisponiblesArriba = todos.filter(
        (p) => p.categoria !== "Medicamentos con Receta",
      );

      const shuffledArriba = [...productosDisponiblesArriba].sort(
        () => Math.random() - 0.5,
      );
      const arriba = shuffledArriba.slice(0, PRODUCTS_PER_SECTION);

      // Productos en ofertas (de campañas activas)
      // Nota: Las campañas ahora retornan productos con descuentos aplicados
      const productosEnOferta = todos.filter(
        (producto) => producto.ofertas && producto.ofertas.length > 0,
      );
      const abajo = productosEnOferta.slice(0, PRODUCTS_PER_SECTION);

      let categoriasUnicas = [...new Set(todos.map((p) => p.categoria))];

      // Agregar "Ofertas" como categoría especial si hay campañas activas
      if (campanasActivas.length > 0 && !categoriasUnicas.includes("Ofertas")) {
        categoriasUnicas = ["Ofertas", ...categoriasUnicas];
      }

      set({
        productosArriba: arriba,
        productosAbajo: abajo,
        productos: todos,
        categorias: categoriasUnicas,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error al traer productos:", error);
      set({
        error: "No se pudieron cargar los productos. Intenta más tarde.",
        isLoading: false,
      });
    }
  },
}));
