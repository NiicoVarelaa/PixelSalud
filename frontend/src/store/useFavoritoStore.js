import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = "http://localhost:5000/favoritos"; 

export const useFavoritosStore = create((set, get) => ({
    favoritos: [], 
    isLoading: false,
    error: null,

    getFavoritos: async (idCliente) => {
        if (!idCliente) {
            console.error("No se puede obtener favoritos: ID de Cliente no proporcionada.");
            return;
        }
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/cliente/${idCliente}`);
            const productosFavoritos = response.data.data; 

            set({ 
                favoritos: productosFavoritos, 
                isLoading: false 
            });
        } catch (err) {
            const isNoFavorites = err.response?.status === 404;
            if (isNoFavorites) {
                 set({ favoritos: [], isLoading: false, error: null });
            } else {
                 console.error("Error al cargar favoritos:", err);
                 set({ 
                    error: "No se pudieron cargar los favoritos.", 
                    isLoading: false 
                 });
                 toast.error('Error al cargar la lista de favoritos.');
            }
        }
    },
    
    toggleFavorito: async (idCliente, idProducto, productoData) => {
        if (!idCliente) {
            toast.error('Debes iniciar sesión para agregar favoritos.');
            return;
        }

        const wasFavorite = get().isProductFavorite(idProducto);
        get().toggleProductoLocal(idProducto, productoData, !wasFavorite);
        
        try {
            const response = await axios.post(`${API_URL}/toggle`, {
                idCliente,
                idProducto
            });
            const { message, isFavorite } = response.data;
            
            const currentState = get().isProductFavorite(idProducto);
            if (currentState !== isFavorite) {
                get().toggleProductoLocal(idProducto, productoData, isFavorite);
            }
            
            toast.success(message);
        } catch (err) {
            console.error("Error en toggleFavorito:", err);
            // Revertir el cambio optimista en caso de error
            get().toggleProductoLocal(idProducto, productoData, wasFavorite);
            const errorMessage = err.response?.data?.message || 'Error al procesar la solicitud de favorito.';
            toast.error(errorMessage);
        }
    },
    
    toggleProductoLocal: (idProducto, productoData, isFavorite) => {
        set((state) => {
            const productoConId = { 
                ...productoData, 
                id: idProducto, 
                idProducto: idProducto 
            };
            
            if (isFavorite) {
                const exists = state.favoritos.some(p => p.idProducto === idProducto);
                if (!exists) {
                    return { favoritos: [productoConId, ...state.favoritos] };
                }
            } else {
                return { 
                    favoritos: state.favoritos.filter(p => p.idProducto !== idProducto) 
                };
            }
            return state; 
        });
    },

    isProductFavorite: (idProducto) => {
        return get().favoritos.some(p => p.idProducto === idProducto);
    }
}));