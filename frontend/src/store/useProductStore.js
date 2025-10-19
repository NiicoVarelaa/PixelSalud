import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:5000/productos";
const PRODUCTS_PER_SECTION = 6;
const PROMO_CATEGORY = "Dermocosmética";
const PROMO_PRODUCTS_COUNT = 10;


export const useProductStore = create((set) => ({
    // --- ESTADO ORIGINAL (NO SE TOCA) ---
    productosArriba: [],
    productosAbajo: [],
    
    // --- NUEVO ESTADO (AÑADIDO) ---
    productos: [],   // Array con TODOS los productos
    categorias: [],  // Array con todas las categorías únicas

    // --- ESTADO EXISTENTE ---
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });

        try {
            const res = await axios.get(API_URL);
            const todos = res.data;

            // --- LÓGICA ORIGINAL (NO SE TOCA) ---
            const productosDisponiblesArriba = todos.filter(
                (p) => p.categoria !== "Medicamentos con Receta"
            );
            const shuffledArriba = [...productosDisponiblesArriba].sort(() => Math.random() - 0.5);
            const arriba = shuffledArriba.slice(0, PRODUCTS_PER_SECTION);

            const productosPromocion = todos.filter(
                (p) => p.categoria === PROMO_CATEGORY
            );
            const abajo = productosPromocion.slice(0, PROMO_PRODUCTS_COUNT);
            
            // --- LÓGICA NUEVA (AÑADIDA) ---
            const categoriasUnicas = [...new Set(todos.map((p) => p.categoria))];

            set({ 
                // Estado original
                productosArriba: arriba, 
                productosAbajo: abajo, 
                // Nuevo estado
                productos: todos,
                categorias: categoriasUnicas,
                // Estado existente
                isLoading: false 
            });
        } catch (error) {
            console.error("Error al traer productos:", error);
            set({ 
                error: "No se pudieron cargar los productos. Intenta más tarde.", 
                isLoading: false 
            });
        }
    },
}));