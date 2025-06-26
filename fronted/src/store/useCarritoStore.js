import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { getCliente } from "./useClienteStore";

export const useCarritoStore = create((set, get) => ({
  carrito: [],

  sincronizarCarrito: async () => {
    try {
      const idCliente = await getCliente()
      const carritoResponse = await axios.get(`http://localhost:5000/carrito/${idCliente}`);
      const carritoServidor = carritoResponse.data;

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
      toast.info("El producto ya se encuentra en el carrito");

    } else {
      await axios.post('http://localhost:5000/carrito/agregar', {
        idProducto: producto.idProducto,
        idCliente: idCliente,
      });

      toast.success("Producto agregado correctamente!");
      set({
        carrito: [...carrito, { ...producto, cantidad: 1 }],
      });
    }

  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    toast.error("Ocurrió un problema al agregar el producto");
  }
},


  // ❌ Elimina completamente un producto del carrito (local)
  eliminarDelCarrito: (id) =>
    set((state) => ({
      carrito: state.carrito.filter((item) => item.idProducto !== id),
    })),

  // 🧹 Vacía el carrito completo
  vaciarCarrito: () => set({ carrito: [] }),

  // 🔼 Aumenta cantidad de un producto en el carrito
  aumentarCantidad: (id) => {
    set((state) => ({
      carrito: state.carrito.map((item) =>
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
