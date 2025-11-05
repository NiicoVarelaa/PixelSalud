import { create } from "zustand";
// 1. Importamos apiClient (asegúrate que la ruta sea correcta)
import apiClient from "../utils/apiClient"; 
// 2. Importamos el store de autenticación
import { useAuthStore } from "./useAuthStore";
import { toast } from 'react-toastify';

export const useCarritoStore = create((set, get) => ({
  // ESTADO INICIAL
  carrito: [], 
  showLoginModal: false,

  // ACCIONES
  setShowLoginModal: (show) => set({ showLoginModal: show }),

  /**
   * Sincroniza el estado local del carrito con el de la base de datos.
   * Usa apiClient, el cual adjunta automáticamente el JWT.
   */
  sincronizarCarrito: async () => {
    const user = useAuthStore.getState().user;

     console.log("🔍 Sincronizando carrito - Usuario:", user);
  console.log("🔍 User ID:", user?.id);

    if (!user) {
       console.log("❌ No hay usuario, carrito vacío");
      set({ carrito: [] });
      return;
    }

    try {
      // Usamos apiClient.get. El JWT ya va en la cabecera 'auth'.
      // Si tu backend necesita el ID en la URL para diferenciar las rutas de cliente/empleado, se mantiene:
      console.log("🔄 Haciendo petición a /carrito/" + user.id);
      const response = await apiClient.get(`/carrito/${user.id}`); 
      console.log("✅ Carrito sincronizado:", response.data);
      
      set({ carrito: response.data });
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      // El interceptor de apiClient manejará el 401 (logout), aquí manejamos otros errores.
      toast.error("No se pudo cargar tu carrito.");
      set({ carrito: [] }); 
    }
  },

  /**
   * Agrega un producto al carrito.
   */
  agregarCarrito: async (producto) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      set({ showLoginModal: true });
      return;
    }

    try {
      // Usamos apiClient.post. El JWT ya va en la cabecera 'auth'.
      await apiClient.post("/carrito/agregar", {
        idProducto: producto.idProducto,
        idCliente: user.id, // Mantenemos idCliente por compatibilidad con tu backend
      });
      
      toast.success("Producto agregado al carrito");
      get().sincronizarCarrito(); 
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error("Ocurrió un problema al agregar el producto");
    }
  },

  /**
   * Elimina un producto específico del carrito de un usuario.
   */
  eliminarDelCarrito: async (idProducto) => {
    const user = useAuthStore.getState().user;
    if (!user) return; 

    try {
      // Usamos apiClient.delete
      await apiClient.delete(`/carrito/eliminar/${user.id}/${idProducto}`);
      
      set((state) => ({
        carrito: state.carrito.filter((p) => p.idProducto !== idProducto),
      }));
      toast.warning("Producto eliminado del carrito");

    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      toast.error("Hubo un problema al eliminar el producto");
    }
  },

  /**
   * Vacía completamente el carrito de un usuario.
   */
  vaciarCarrito: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      // Usamos apiClient.delete
      await apiClient.delete(`/carrito/vaciar/${user.id}`);
      set({ carrito: [] });
      toast.warning("Carrito vaciado correctamente");
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      toast.error("Hubo un problema al vaciar el carrito");
    }
  },

  /**
   * Aumenta la cantidad de un producto en el carrito.
   */
  aumentarCantidad: async (idProducto) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      // Usamos apiClient.put
      await apiClient.put(`/carrito/aumentar`, { 
        idProducto, 
        idCliente: user.id 
      });
      
      set((state) => ({
        carrito: state.carrito.map((p) =>
          p.idProducto === idProducto ? { ...p, cantidad: p.cantidad + 1 } : p
        ),
      }));
      toast.info("Cantidad actualizada");

    } catch (error) {
      console.error("Error al aumentar la cantidad:", error);
      toast.error("No se pudo actualizar la cantidad");
    }
  },

  /**
   * Disminuye la cantidad de un producto en el carrito (mínimo 1).
   */
  disminuirCantidad: async (idProducto) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    const item = get().carrito.find(p => p.idProducto === idProducto);
    if (item && item.cantidad <= 1) return;

    try {
      // Usamos apiClient.put
      await apiClient.put(`/carrito/disminuir`, { 
        idProducto, 
        idCliente: user.id 
      });

      set((state) => ({
        carrito: state.carrito.map((p) =>
          p.idProducto === idProducto ? { ...p, cantidad: p.cantidad - 1 } : p
        ),
      }));
      toast.info("Cantidad actualizada");

    } catch (error)
    {
      console.error("Error al disminuir la cantidad:", error);
      toast.error("No se pudo actualizar la cantidad");
    }
  },
}));