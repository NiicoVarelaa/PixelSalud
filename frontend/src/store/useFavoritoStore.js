import { create } from 'zustand';
import apiClient from '../utils/apiClient'; 
import { toast } from 'react-toastify';
import { useAuthStore } from './useAuthStore';
import { useCarritoStore } from './useCarritoStore';


export const useFavoritosStore = create((set, get) => ({
    favoritos: [], 
    isLoading: false,
    error: null,

    getFavoritos: async () => {
        const user = useAuthStore.getState().user;

        if (!user) {
            set({ favoritos: [] }); 
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/favoritos');             
            set({ 
                favoritos: response.data, 
                isLoading: false 
            });
        } catch (err) {
            console.error("Error al cargar favoritos:", err);
            set({ 
                error: "No se pudieron cargar los favoritos.", 
                isLoading: false 
            });
            toast.error('Error al cargar la lista de favoritos.');
        }
    },
    
    toggleFavorito: async (idProducto, productoData) => {
        const user = useAuthStore.getState().user;

        if (!user) {
            useCarritoStore.getState().setShowLoginModal(true);
            return;
        }

        const wasFavorite = get().isProductFavorite(idProducto);
        get()._toggleProductoLocal(idProducto, productoData, !wasFavorite);
        
        try {
            const response = await apiClient.post('/favoritos/toggle', {
                idProducto
            });
            
            const { message, isFavorite } = response.data;
            
            const currentState = get().isProductFavorite(idProducto);
            if (currentState !== isFavorite) {
                get()._toggleProductoLocal(idProducto, productoData, isFavorite);
            }
            
            if (isFavorite) {
                toast.success(message);
            } else {
                toast.warning(message);
            }
        } catch (err) {
            console.error("Error en toggleFavorito:", err);
            get()._toggleProductoLocal(idProducto, productoData, wasFavorite);
            toast.error('Ocurrió un error al guardar tu favorito.');
        }
    },
    
    _toggleProductoLocal: (idProducto, productoData, isFavorite) => {
        set((state) => {
            if (isFavorite) {
                const exists = state.favoritos.some(p => p.idProducto === idProducto);
                if (!exists) {
                    return { favoritos: [{ ...productoData, idProducto }, ...state.favoritos] };
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