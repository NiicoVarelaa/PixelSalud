import { create } from 'zustand';

import axios from 'axios';

const API_URL = "http://localhost:5000/favoritos"; 

export const useFavoritosStore = create((set, get) => ({
    favoritos: [], 
    isLoading: false,
    error: null,

    toast: {
        isVisible: false,
        message: '',
        type: 'success',
    },
    showToast: (message, type = 'success') => {
        set({ 
            toast: {
                isVisible: true,
                message,
                type,
            }
        });
        setTimeout(() => {
            set((state) => ({
                toast: { ...state.toast, isVisible: false }
            }));
        }, 3000);
    },
    hideToast: () => {
        set((state) => ({
            toast: { ...state.toast, isVisible: false }
        }));
    },

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
                 get().showToast('Error al cargar la lista de favoritos.', 'error');
            }
        }
    },
    
    toggleFavorito: async (idCliente, idProducto, productoData) => {
        if (!idCliente) {
            get().showToast('Debes iniciar sesión para agregar favoritos.', 'error');
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/toggle`, {
                idCliente,
                idProducto
            });
            const { message, isFavorite } = response.data;
            get().showToast(message, 'success');
            get().toggleProductoLocal(idProducto, productoData, isFavorite);
        } catch (err) {
            console.error("Error en toggleFavorito:", err);
            const errorMessage = err.response?.data?.message || 'Error al procesar la solicitud de favorito.';
            get().showToast(errorMessage, 'error');
        }
    },
    
    toggleProductoLocal: (idProducto, productoData, isFavorite) => {
        set((state) => {
            const productoConId = { ...productoData, id: idProducto };
            if (isFavorite) {
                const exists = state.favoritos.some(p => p.id === idProducto);
                if (!exists) {
                    return { favoritos: [productoConId, ...state.favoritos] };
                }
            } else {
                return { 
                    favoritos: state.favoritos.filter(p => p.id !== idProducto) 
                };
            }
            return state; 
        });
    },

    isProductFavorite: (idProducto) => {
        return get().favoritos.some(p => p.id === idProducto);
    }
}));