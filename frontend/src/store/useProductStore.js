// useProductStore.js
import { create } from "zustand";
import axios from "axios";

// 🚨 Nuevo Endpoint para el Cyber Monday
const API_URL_ALL = "http://localhost:5000/productos"; 
const API_URL_CYBER_MONDAY = "http://localhost:5000/productos/ofertas/cyber-monday"; 
// La lógica de getOfertasDestacadas, aunque existe, no se usará aquí
// en favor del endpoint específico de Cyber Monday.

const PRODUCTS_PER_SECTION = 6;
// const PROMO_CATEGORY = "Dermocosmética"; // Ya no necesario para productosAbajo
// const PROMO_PRODUCTS_COUNT = 10; // Ya no necesario

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
      // Llamada 1: Traer TODOS los productos (para productosArriba, lista completa y categorías)
      const [resAll, resCyber] = await Promise.all([
          axios.get(API_URL_ALL),
          axios.get(API_URL_CYBER_MONDAY) // Llamada 2: Traer SOLO las ofertas de Cyber Monday
      ]);
      
      const todos = resAll.data; 
      // 🚨 ASIGNACIÓN CLAVE: Ahora productosAbajo usa los datos del endpoint optimizado
      const cyberOffers = resCyber.data; 

      // 2. Lógica de la sección superior (Productos Arriba) - SIN CAMBIOS
      const productosDisponiblesArriba = todos.filter(
        (p) => p.categoria !== "Medicamentos con Receta"
      );

      const shuffledArriba = [...productosDisponiblesArriba].sort(
        () => Math.random() - 0.5
      );
      const arriba = shuffledArriba.slice(0, PRODUCTS_PER_SECTION);

      // 3. Lógica de la sección inferior (productosAbajo) - CAMBIADA
      //    Ahora usa los datos del endpoint optimizado y no requiere filtro ni slice.
      //    Nota: El endpoint de Cyber Monday ya filtra y trae productos en oferta.
      const abajo = cyberOffers; 

      // 4. Obtener categorías únicas - SIN CAMBIOS
      const categoriasUnicas = [...new Set(todos.map((p) => p.categoria))];

      set({
        productosArriba: arriba,
        productosAbajo: abajo, // <--- LISTO: Ahora trae los productos del Cyber Monday
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