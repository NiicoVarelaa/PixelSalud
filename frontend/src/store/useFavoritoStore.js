import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
// 1. Importa el store de autenticación como única fuente de verdad sobre el usuario
import { useAuthStore } from './useAuthStore';
// Importamos el store del carrito SÓLO para usar su modal de login
import { useCarritoStore } from './useCarritoStore';

const API_URL = "http://localhost:5000/favoritos"; 

export const useFavoritosStore = create((set, get) => ({
    // ESTADO
    favoritos: [], 
    isLoading: false,
    error: null,

    // ACCIONES

    /**
     * Obtiene y carga los productos favoritos del usuario logueado.
     * Ya no necesita recibir el idCliente, lo obtiene del AuthStore.
     */
    getFavoritos: async () => {
        const user = useAuthStore.getState().user;

        if (!user) {
            set({ favoritos: [] }); // Limpiamos favoritos si el usuario cierra sesión.
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/cliente/${user.id}`);
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
    
    /**
     * Agrega o elimina un producto de la lista de favoritos.
     * Ya no necesita recibir el idCliente.
     */
    toggleFavorito: async (idProducto, productoData) => {
        const user = useAuthStore.getState().user;

        if (!user) {
            // Si no hay usuario, usamos la acción del carrito store para mostrar el modal de login.
            useCarritoStore.getState().setShowLoginModal(true);
            return;
        }

        const wasFavorite = get().isProductFavorite(idProducto);
        // Actualización optimista: cambiamos la UI al instante.
        get()._toggleProductoLocal(idProducto, productoData, !wasFavorite);
        
        try {
            const response = await axios.post(`${API_URL}/toggle`, {
                idCliente: user.id,
                idProducto
            });
            
            const { message, isFavorite } = response.data;
            
            // Si el estado del servidor no coincide con el nuestro, lo revertimos.
            const currentState = get().isProductFavorite(idProducto);
            if (currentState !== isFavorite) {
                get()._toggleProductoLocal(idProducto, productoData, isFavorite);
            }
            
            // Mostramos la notificación correspondiente.
            if (isFavorite) {
                toast.success(message);
            } else {
                toast.warning(message);
            }

        } catch (err) {
            console.error("Error en toggleFavorito:", err);
            // Si hay un error en la API, revertimos el cambio en la UI.
            get()._toggleProductoLocal(idProducto, productoData, wasFavorite);
            toast.error('Ocurrió un error al guardar tu favorito.');
        }
    },
    
    /**
     * Función interna para manejar la lógica de agregar/quitar del estado local.
     * (Renombrada con '_' para indicar que es para uso interno del store).
     */
    _toggleProductoLocal: (idProducto, productoData, isFavorite) => {
        set((state) => {
            if (isFavorite) {
                // Agregar a favoritos si no existe
                const exists = state.favoritos.some(p => p.idProducto === idProducto);
                if (!exists) {
                    return { favoritos: [{ ...productoData, idProducto }, ...state.favoritos] };
                }
            } else {
                // Eliminar de favoritos
                return { 
                    favoritos: state.favoritos.filter(p => p.idProducto !== idProducto) 
                };
            }
            return state; // No hacer nada si el estado ya es el correcto
        });
    },

    /**
     * Verifica si un producto ya está en la lista de favoritos.
     */
    isProductFavorite: (idProducto) => {
        return get().favoritos.some(p => p.idProducto === idProducto);
    }
}));