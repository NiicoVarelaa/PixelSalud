import { create } from "zustand";
import { useAuthStore } from "@store/useAuthStore";
import { toast } from "react-toastify";
import { carritoService } from "@services/carritoService";

export const useCarritoStore = create((set, get) => ({
  carrito: [],
  showLoginModal: false,
  isCartModalOpen: false,

  setShowLoginModal: (show) => set({ showLoginModal: show }),
  setIsCartModalOpen: (isOpen) => set({ isCartModalOpen: isOpen }),

  sincronizarCarrito: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ carrito: [] });
      return;
    }

    try {
      const data = await carritoService.getSincronizar(user.id);
      set({ carrito: data });
    } catch {
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
      await carritoService.agregar(producto.idProducto, user.id);
      toast.success("Producto agregado al carrito");
      get().sincronizarCarrito();
    } catch {
      toast.error("Ocurrió un problema al agregar el producto");
    }
  },

  eliminarDelCarrito: async (idProducto) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      await carritoService.eliminar(user.id, idProducto);
      set((state) => ({
        carrito: state.carrito.filter((p) => p.idProducto !== idProducto),
      }));
      toast.warning("Producto eliminado del carrito");
    } catch {
      toast.error("Hubo un problema al eliminar el producto");
    }
  },

  vaciarCarrito: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      await carritoService.vaciar(user.id);
      set({ carrito: [] });
      toast.warning("Carrito vaciado correctamente");
    } catch {
      toast.error("Hubo un problema al vaciar el carrito");
    }
  },

  aumentarCantidad: async (idProducto) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      await carritoService.aumentarCantidad(idProducto, user.id);
      set((state) => ({
        carrito: state.carrito.map((p) =>
          p.idProducto === idProducto ? { ...p, cantidad: p.cantidad + 1 } : p,
        ),
      }));
      toast.info("Cantidad actualizada");
    } catch {
      toast.error("No se pudo actualizar la cantidad");
    }
  },

  disminuirCantidad: async (idProducto) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const item = get().carrito.find((p) => p.idProducto === idProducto);
    if (item && item.cantidad <= 1) return;

    try {
      await carritoService.disminuirCantidad(idProducto, user.id);
      set((state) => ({
        carrito: state.carrito.map((p) =>
          p.idProducto === idProducto ? { ...p, cantidad: p.cantidad - 1 } : p,
        ),
      }));
      toast.info("Cantidad actualizada");
    } catch {
      toast.error("No se pudo actualizar la cantidad");
    }
  },
}));
