import { create } from "zustand";
import axios from "axios";

const API_URL_ALL = "http://localhost:5000/productos";
const API_URL_CYBER_MONDAY = "http://localhost:5000/ofertas/cyber-monday";

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
      const [resAll, resCyber] = await Promise.all([
        axios.get(API_URL_ALL),
        axios.get(API_URL_CYBER_MONDAY),
      ]);

      const todos = resAll.data;
      const cyberOffers = resCyber.data;
      const productosDisponiblesArriba = todos.filter(
        (p) => p.categoria !== "Medicamentos con Receta",
      );

      const shuffledArriba = [...productosDisponiblesArriba].sort(
        () => Math.random() - 0.5,
      );
      const arriba = shuffledArriba.slice(0, PRODUCTS_PER_SECTION);
      const abajo = cyberOffers;
      let categoriasUnicas = [...new Set(todos.map((p) => p.categoria))];
      // Agregar Cyber Monday como categoría especial si hay productos en la oferta
      if (
        cyberOffers &&
        cyberOffers.length > 0 &&
        !categoriasUnicas.includes("Cyber Monday")
      ) {
        categoriasUnicas = ["Cyber Monday", ...categoriasUnicas];
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
