import { create } from "zustand";
import apiClient from "../utils/apiClient"; 
import { useAuthStore } from "./useAuthStore";
import { toast } from 'react-toastify';

export const useCarritoStore = create((set, get) => ({
  carrito: [], 
  showLoginModal: false,

  setShowLoginModal: (show) => set({ showLoginModal: show }),

  sincronizarCarrito: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ carrito: [] });
      return;
    }

    try {
      const response = await apiClient.get(`/carrito/${user.id}`);
      set({ carrito: response.data });
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      toast.error("No se pudo cargar tu carrito.");
      set({ carrito: [] }); 
    }
  },

  agregarCarrito: async (producto) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      set({ showLoginModal: true });
      return;
    }

    try {
      await apiClient.post("/carrito/agregar", {
        idProducto: producto.idProducto,
        idCliente: user.id,
      });      
      toast.success("Producto agregado al carrito");
      get().sincronizarCarrito(); 
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error("Ocurrió un problema al agregar el producto");
    }
  },

  eliminarDelCarrito: async (idProducto) => {
    const user = useAuthStore.getState().user;
    if (!user) return; 

    try {
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

  vaciarCarrito: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      await apiClient.delete(`/carrito/vaciar/${user.id}`);
      set({ carrito: [] });
      toast.warning("Carrito vaciado correctamente");
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      toast.error("Hubo un problema al vaciar el carrito");
    }
  },

  aumentarCantidad: async (idProducto) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
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

  disminuirCantidad: async (idProducto) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    const item = get().carrito.find(p => p.idProducto === idProducto);
    if (item && item.cantidad <= 1) return;

    try {
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