import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useClienteStore } from "./useClienteStore";

export const useCarritoStore = create((set, get) => ({
  carrito: [],

  // Sincronizar carrito con el servidor
  sincronizarCarrito: async () => {
    try {
      const cliente = useClienteStore.getState().cliente;
      if (!cliente) {
        set({ carrito: [] });
        return;
      }

      const idCliente = cliente.idCliente;

      const carritoResponse = await axios.get(
        `http://localhost:5000/carrito/${idCliente}`
      );
      const carritoServidor = carritoResponse.data;
      const idsProductosCarrito = carritoServidor.map(
        (prods) => prods.idProducto
      );

      const getProductos = await axios.get(`http://localhost:5000/productos`);
      const productos = getProductos.data;

      const productosEnCarrito = productos
        .filter((producto) => idsProductosCarrito.includes(producto.idProducto))
        .map((producto) => {
          const itemServidor = carritoServidor.find(
            (item) => item.idProducto === producto.idProducto
          );
          return { ...producto, cantidad: itemServidor?.cantidad || 1 };
        });

      set({ carrito: productosEnCarrito });
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      toast.error("Error al sincronizar el carrito");
    }
  },

  // Agregar producto
  agregarCarrito: async (producto) => {
    const { carrito } = get();

    try {
      const cliente = useClienteStore.getState().cliente;
      if (!cliente) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Debes estar logueado para realizar esta acción!",
          footer: `<a href="../Login">¿Quieres iniciar sesión?</a>`,
        });
        return;
      }

      const idCliente = cliente.idCliente;

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

  // Elimina producto del carrito
  eliminarDelCarrito: async (id) => {
    try {
      const eliminar = await axios.delete(
        `http://localhost:5000/carrito/eliminar/${id}`
      );
      if (eliminar) {
        const { carrito } = get();
        const carritoActualizado = carrito.filter(
          (producto) => producto.idProducto !== id
        );
        set({ carrito: carritoActualizado });
        toast.success("Producto eliminado correctamente!");
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      toast.error("Hubo un problema al eliminar el producto");
    }
  },

  // Vacía el carrito
  vaciarCarrito: async () => {
    try {
      const cliente = useClienteStore.getState().cliente;
      if (!cliente) {
        console.log("No se pudo vaciar el carrito, usuario no logueado.");
        return;
      }

      const idCliente = cliente.idCliente;

      const vaciar = await axios.delete(
        `http://localhost:5000/carrito/vaciar/${idCliente}`
      );

      if (vaciar) {
        set({ carrito: [] });
        toast.success("Carrito vaciado correctamente!");
      }
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      toast.error("Hubo un problema al vaciar el carrito");
    }
  },

  // Aumenta cantidad
  aumentarCantidad: async (id) => {
    try {
      const aumento = await axios.put(
        `http://localhost:5000/carrito/aumentar/${id}`
      );
      if (aumento) {
        const { carrito } = get();
        const carritoActualizado = carrito.map((producto) =>
          producto.idProducto === id
            ? { ...producto, cantidad: producto.cantidad + 1 }
            : producto
        );
        set({ carrito: carritoActualizado });
        toast.success("Cantidad aumentada correctamente!");
      }
    } catch (error) {
      console.error("Error al aumentar la cantidad:", error);
      toast.error("Hubo un problema al aumentar la cantidad");
    }
  },

  // Disminuye cantidad
  disminuirCantidad: async (id) => {
    try {
      const disminuir = await axios.put(
        `http://localhost:5000/carrito/disminuir/${id}`
      );
      if (disminuir) {
        const { carrito } = get();
        const carritoActualizado = carrito.map((producto) =>
          producto.idProducto === id && producto.cantidad > 1
            ? { ...producto, cantidad: producto.cantidad - 1 }
            : producto
        );
        set({ carrito: carritoActualizado });
        toast.success("Cantidad disminuida correctamente!");
      }
    } catch (error) {
      console.error("Error al disminuir la cantidad:", error);
      toast.error("Hubo un problema al disminuir la cantidad");
    }
  },
}));
