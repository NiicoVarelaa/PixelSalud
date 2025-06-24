import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export const useCarritoStore = create((set, get) => ({
  carrito: [],

  sincronizarCarrito: async () => {
    try {
      const { data: usuarios } = await axios.get('http://localhost:5000/clientes');
      const usuarioLogueado = usuarios.find(user => user.logueado === 1);
      if (!usuarioLogueado) return;

      const { idCliente } = usuarioLogueado;
      const { data: carritoServidor } = await axios.get(`http://localhost:5000/carrito/${idCliente}`);

      set({ carrito: carritoServidor });
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      toast.error("Error al sincronizar el carrito");
    }
  },

  agregarCarrito: async (producto) => {
    try {
      const { carrito } = get();

      const { data: usuarios } = await axios.get('http://localhost:5000/clientes');
      const usuarioLogueado = usuarios.find(user => user.logueado === 1);
      if (!usuarioLogueado) {
        toast.error("Debés iniciar sesión para agregar productos al carrito");
        return;
      }

      const { idCliente } = usuarioLogueado;

      // Chequear si producto ya está en carrito (servidor)
      const { data: carritoServidor } = await axios.get(`http://localhost:5000/carrito/${idCliente}`);
      const yaExiste = carritoServidor.some(item => item.idProducto === producto.idProducto);

      if (yaExiste) {
        // Actualizamos la cantidad localmente (se puede sincronizar con backend si lo deseas)
        set({
          carrito: carrito.map(item =>
            item.idProducto === producto.idProducto
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          ),
        });
      } else {
        // Agregamos producto al backend
        await axios.post('http://localhost:5000/carrito/agregar', {
          idProducto: producto.idProducto,
          idCliente,
        });

        set({
          carrito: [...carrito, { ...producto, cantidad: 1 }],
        });
      }

      toast.success("Producto agregado al carrito");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error("Ocurrió un problema al agregar el producto");
    }
  },

  eliminarDelCarrito: (id) => {
    set(state => ({
      carrito: state.carrito.filter(item => item.idProducto !== id),
    }));
    toast.info("Producto eliminado del carrito");
  },

  vaciarCarrito: () => {
    set({ carrito: [] });
    toast.info("Carrito vaciado");
  },

  aumentarCantidad: (id) => {
    set(state => ({
      carrito: state.carrito.map(item =>
        item.idProducto === id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ),
    }));
    toast.success("Cantidad incrementada");
  },

  disminuirCantidad: (id) => {
    const { carrito } = get();
    const producto = carrito.find(item => item.idProducto === id);

    if (!producto) return;

    if (producto.cantidad > 1) {
      set(state => ({
        carrito: state.carrito.map(item =>
          item.idProducto === id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        ),
      }));
      toast.info("Cantidad disminuida");
    } else {
      toast.warning("La cantidad mínima es 1. Usa eliminar para borrar el producto.");
    }
  },
}));
