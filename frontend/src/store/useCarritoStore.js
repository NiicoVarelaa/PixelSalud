import { create } from "zustand";
import axios from "axios";
// 1. Importamos el store de autenticación unificado
import { useAuthStore } from "./useAuthStore";
import { toast } from 'react-toastify';

export const useCarritoStore = create((set, get) => ({
  // ESTADO INICIAL
  carrito: [], // Almacenará los productos del carrito con todos sus detalles.
  showLoginModal: false,

  // ACCIONES
  setShowLoginModal: (show) => set({ showLoginModal: show }),

  /**
   * Sincroniza el estado local del carrito con el de la base de datos.
   * Ahora es mucho más eficiente: una sola llamada a la API obtiene todo lo necesario.
   */
  sincronizarCarrito: async () => {
    // Obtenemos el usuario del store de autenticación.
    const user = useAuthStore.getState().user;

    if (!user) {
      // Si no hay usuario, nos aseguramos de que el carrito local esté vacío.
      set({ carrito: [] });
      return;
    }

    try {
      // El backend ahora devuelve los productos del carrito con todos sus detalles.
      const response = await axios.get(`http://localhost:5000/carrito/${user.id}`);
      set({ carrito: response.data });
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      toast.error("No se pudo cargar tu carrito.");
      set({ carrito: [] }); // En caso de error, vaciamos el carrito para evitar datos incorrectos.
    }
  },

  /**
   * Agrega un producto al carrito.
   * La lógica de "si ya existe, incrementa cantidad" ahora la maneja el backend.
   */
  agregarCarrito: async (producto) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      // Si el usuario no está logueado, mostramos el modal de login.
      set({ showLoginModal: true });
      return;
    }

    try {
      await axios.post("http://localhost:5000/carrito/agregar", {
        idProducto: producto.idProducto,
        idCliente: user.id,
      });
      
      toast.success("Producto agregado al carrito");
      // Después de agregar, volvemos a sincronizar para tener el estado más actualizado.
      get().sincronizarCarrito(); 
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error("Ocurrió un problema al agregar el producto");
    }
  },

  /**
   * Elimina un producto específico del carrito de un usuario.
   * Utiliza la nueva ruta segura que requiere idCliente y idProducto.
   */
  eliminarDelCarrito: async (idProducto) => {
    const user = useAuthStore.getState().user;
    if (!user) return; // No debería pasar si el botón solo se muestra a usuarios logueados.

    try {
      // Usamos la nueva ruta segura.
      await axios.delete(`http://localhost:5000/carrito/eliminar/${user.id}/${idProducto}`);
      
      // Actualizamos el estado local de forma optimista para una respuesta visual instantánea.
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
      await axios.delete(`http://localhost:5000/carrito/vaciar/${user.id}`);
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
      await axios.put(`http://localhost:5000/carrito/aumentar`, { 
        idProducto, 
        idCliente: user.id 
      });
      
      // Actualización local para feedback inmediato.
      set((state) => ({
        carrito: state.carrito.map((p) =>
          p.idProducto === idProducto ? { ...p, cantidad: p.cantidad + 1 } : p
        ),
      }));
      // --- CAMBIO REALIZADO AQUÍ ---
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
    
    // Evita que la cantidad baje a 0 desde el frontend
    const item = get().carrito.find(p => p.idProducto === idProducto);
    if (item && item.cantidad <= 1) return;

    try {
      await axios.put(`http://localhost:5000/carrito/disminuir`, { 
        idProducto, 
        idCliente: user.id 
      });

      // Actualización local para feedback inmediato.
      set((state) => ({
        carrito: state.carrito.map((p) =>
          p.idProducto === idProducto ? { ...p, cantidad: p.cantidad - 1 } : p
        ),
      }));
      // --- CAMBIO REALIZADO AQUÍ ---
      toast.info("Cantidad actualizada");

    } catch (error)
    {
      console.error("Error al disminuir la cantidad:", error);
      toast.error("No se pudo actualizar la cantidad");
    }
  },
}));