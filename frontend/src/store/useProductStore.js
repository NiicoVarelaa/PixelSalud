import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:5000/productos";
const PRODUCTS_PER_SECTION = 6;

export const useProductStore = create((set) => ({
    
    productosArriba: [],
    productosAbajo: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });

        try {
            const res = await axios.get(API_URL);
            const todos = res.data;
            const shuffled = [...todos].sort(() => Math.random() - 0.5);

            const arriba = shuffled.slice(0, PRODUCTS_PER_SECTION);            
            const usadosIds = new Set(arriba.map((p) => p.idProducto));            
            const abajo = shuffled
                .filter((p) => !usadosIds.has(p.idProducto))
                .slice(0, PRODUCTS_PER_SECTION);                
            set({ 
                productosArriba: arriba, 
                productosAbajo: abajo, 
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