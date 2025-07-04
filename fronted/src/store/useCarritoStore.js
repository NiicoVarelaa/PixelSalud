import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { getCliente } from "./useClienteStore";
import Swal from "sweetalert2";


export const useCarritoStore = create((set, get) => ({
  carrito: [],
  sincronizarCarrito: async () => {
    try {
      const idCliente = await getCliente();
      
      if (!idCliente) {
        set({ carrito: [] }); 
        console.log("No logged-in user found, carrito not synchronized.");
        return; 
      }

      console.log("Cliente ID for sync:", idCliente); 
      const carritoResponse = await axios.get(
        `http://localhost:5000/carrito/${idCliente}`
      );
      const carritoServidor = carritoResponse.data;
      const idsProductosCarrito = carritoServidor.map(
        (prods) => prods.idProducto
      );
      const getProductos = await axios.get(`http://localhost:5000/productos`);
      const productos = getProductos.data;

      const productosEnCarrito = productos.filter((producto) =>
        idsProductosCarrito.includes(producto.idProducto)
      );

      set({ carrito: productosEnCarrito });
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      toast.error("Error al sincronizar el carrito");
    }
  },

  agregarCarrito: async (producto) => {
    const { carrito } = get();

    try {
      const idCliente = await getCliente();
      if (!idCliente) {
       
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Debes estar logueado para realizar esta accion!",
          footer: `<a href="../Login">¿Quieres iniciar sesion?</a>`,
        });
        return
      }
      
      const carritoResponse = await axios.get(
        `http://localhost:5000/carrito/${idCliente}`
      );
      const carritoServidor = carritoResponse.data;

      const yaExiste = carritoServidor.some(
        (item) => item.idProducto === producto.idProducto
      );

      if (yaExiste) {
        toast.info("El producto ya se encuentra en el carrito");
      } else {
        await axios.post("http://localhost:5000/carrito/agregar", {
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
  eliminarDelCarrito: async (id) => {
    try {
      const eliminar = await axios.delete(
        `http://localhost:5000/carrito/eliminar/${id}`
      );
      if (eliminar) {
        // Elimina el producto del carrito en el estado global (zustand)
        const { carrito } = get();
        const carritoActualizado = carrito.filter(
          (producto) => producto.idProducto !== id
        );
        set({ carrito: carritoActualizado }); // Actualiza el estado de zustand
        Swal.fire({
          title: "Producto eliminado correctamente!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      toast.error("Hubo un problema al eliminar el producto");
    }
  },

  // 🧹 Vacía el carrito completo
  vaciarCarrito: () => set({ carrito: [] }),

  // 🔼 Aumenta cantidad de un producto en el carrito
  aumentarCantidad: async (id) => {
    try {
      const aumento = await axios.put(
        `http://localhost:5000/carrito/aumentar/${id}`
      );
      if (aumento) {
        // Actualiza el carrito en el estado global (zustand)
        const { carrito } = get();
        const carritoActualizado = carrito.map((producto) =>
          producto.idProducto === id
            ? { ...producto, cantidad: producto.cantidad + 1 }
            : producto
        );
        set({ carrito: carritoActualizado }); // Actualiza el estado de zustand
        toast.success("Cantidad aumentada correctamente!");
      }
    } catch (error) {
      console.error("Error al aumentar la cantidad:", error);
      toast.error("Hubo un problema al aumentar la cantidad");
    }
  },

  // 🔽 Disminuye cantidad (si llega a 1, deberías confirmar antes de eliminar si querés)
  disminuirCantidad: async (id) => {
    try {
      const disminuir = await axios.put(
        `http://localhost:5000/carrito/disminuir/${id}`
      );
      if (disminuir) {
        // Actualiza el carrito en el estado global (zustand)
        const { carrito } = get();
        const carritoActualizado = carrito.map((producto) =>
          producto.idProducto === id && producto.cantidad > 1
            ? { ...producto, cantidad: producto.cantidad - 1 }
            : producto
        );
        set({ carrito: carritoActualizado }); // Actualiza el estado de zustand
        toast.success("Cantidad disminuida correctamente!");
      }
    } catch (error) {
      console.error("Error al disminuir la cantidad:", error);
      toast.error("Hubo un problema al disminuir la cantidad");
    }
  },
}));