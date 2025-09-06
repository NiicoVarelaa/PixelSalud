import { create } from "zustand";
import { getCliente } from "./useClienteStore";
import Swal from "sweetalert2";
import axios from "axios";
import { useCarritoStore } from "./useCarritoStore";

export const useCompraStore = create(() => ({
  realizarCompraInd: async (producto, metodoPago) => {
    try {
      const idCliente = await getCliente();
      if (!idCliente) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Debes estar logueado para realizar esta accion!",
          footer: `<a href="../Login">¿Quieres iniciar sesion?</a>`,
        });
        return;
      }
      const compra = {
        totalPago: producto.precio * producto.cantidad,
        metodoPago: metodoPago,
        tipoEntrega: "Sucursal", // Por defecto en compras individuales
        estado: "Pendiente",
        idCliente,
        productos: [
          {
            idProducto: producto.idProducto,
            cantidad: producto.cantidad,
            precioUnitario: producto.precio,
          },
        ],
      };

      await axios.post("http://localhost:5000/ventaOnline/crear", compra);

      Swal.fire({
        icon: "success",
        title: "¡Compra realizada!",
        text: `Tu compra se procesó con éxito.`,
      });
    } catch (error) {
      console.error("Error al realizar la compra", error);
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error",
        text: "No se pudo procesar la compra.",
      });
    }
  },

  /**
   * Realiza compra desde el carrito
   * @param {string} metodoPago - 'Tarjeta de Crédito', 'Transferencia Bancaria', 'Efectivo'
   * @param {string} tipoEntrega - 'Sucursal' o 'Envio'
   * @param {object|null} direccionEnvio - datos de envío si corresponde
   */
  realizarCompraCarrito: async (metodoPago, tipoEntrega = "Sucursal", direccionEnvio = null) => {
    try {
      const idCliente = await getCliente();
      if (!idCliente) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Debes estar logueado para realizar esta acción!",
          footer: `<a href="../LoginCliente">¿Quieres iniciar sesión?</a>`,
        });
        return;
      }

      const carrito = useCarritoStore.getState().carrito;

      if (carrito.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Tu carrito está vacío",
          text: "Agrega productos antes de comprar.",
        });
        return;
      }

      const totalPago = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

      const compra = {
        totalPago,
        metodoPago,
        tipoEntrega,
        estado: "Pendiente",
        idCliente,
        productos: carrito.map((prod) => ({
          idProducto: prod.idProducto,
          cantidad: prod.cantidad,
          precioUnitario: prod.precio,
        })),
        direccionEnvio: tipoEntrega === "Envio" ? direccionEnvio : null
      };

      await axios.post("http://localhost:5000/ventaOnline/crear", compra);

      await axios.delete(`http://localhost:5000/carrito/vaciar/${idCliente}`);
      useCarritoStore.getState().vaciarCarrito?.();

      Swal.fire({
        icon: "success",
        title: "¡Compra realizada!",
        text: `Tu compra se procesó con éxito`,
      });

    } catch (error) {
      console.error("Error al realizar la compra desde el carrito", error);
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error",
        text: "No se pudo procesar la compra desde el carrito.",
      });
    }
  }
}));
