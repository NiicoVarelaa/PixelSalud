import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export const useCarritoStore = create((set, get) => ({
  carrito: [],

  // 🔄 Sincroniza el carrito desde la base de datos del usuario logueado
  sincronizarCarrito: async () => {
    try {
      const usuariosResponse = await axios.get('http://localhost:5000/clientes');
      const usuarios = usuariosResponse.data;
      const usuarioLogueado = usuarios.find(user => user.logueado === 1);

      if (!usuarioLogueado) {
        console.warn("No hay usuario logueado para sincronizar el carrito.");
        return;
      }

      const idCliente = usuarioLogueado.idCliente;
      const carritoResponse = await axios.get(`http://localhost:5000/carrito/${idCliente}`);
      const carritoServidor = carritoResponse.data;

      set({ carrito: carritoServidor });
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      toast.error("Error al sincronizar el carrito");
    }
  },

  // ➕ Agrega un producto al carrito (con validación backend)
  agregarCarrito: async (producto) => {
  const { carrito } = get();

  try {
    const usuariosResponse = await axios.get('http://localhost:5000/clientes');
    const usuarios = usuariosResponse.data;
    const usuarioLogueado = usuarios.find(user => user.logueado === 1);

    if (!usuarioLogueado) {
      toast.error("Debés iniciar sesión para agregar productos al carrito");
      return;
    }

    const idCliente = usuarioLogueado.idCliente;
    const carritoResponse = await axios.get(`http://localhost:5000/carrito/${idCliente}`);
    const carritoServidor = carritoResponse.data;

    const yaExiste = carritoServidor.some(item => item.idProducto === producto.idProducto);

    if (yaExiste) {
      toast.info("El producto ya estaba en el carrito, se sumó la cantidad");
      set({
        carrito: carrito.map((item) =>
          item.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ),
      });
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
  aumentarCantidad: (id) =>
    set((state) => ({
      carrito: state.carrito.map((item) =>
        item.idProducto === id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ),
    })),

  // 🔽 Disminuye cantidad (si llega a 1, deberías confirmar antes de eliminar si querés)
  disminuirCantidad: (id) =>
    set((state) => ({
      carrito: state.carrito.map((item) =>
        item.idProducto === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      ),
    })),
}));
