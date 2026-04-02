import { create } from "zustand";
import { getCliente } from "./useClienteStore";
import Swal from "sweetalert2";
import axios from "axios";
import { marcarRecetaUsada } from "../utils/recetaUtils";
import { useAuthStore } from "./useAuthStore";
import { useCarritoStore } from "./useCarritoStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const construirDireccionEnvioDesdePerfil = async (idCliente, token) => {
  const headers = {
    auth: `Bearer ${token}`,
  };

  const [direccionRes, clienteRes] = await Promise.all([
    axios.get(
      `${API_BASE_URL}/clientes/${idCliente}/direcciones/predeterminada`,
      {
        headers,
      },
    ),
    axios.get(`${API_BASE_URL}/clientes/${idCliente}`, { headers }),
  ]);

  const direccion = direccionRes.data;
  const cliente = clienteRes.data;
  const nombreDestinatario =
    `${cliente?.nombreCliente || ""} ${cliente?.apellidoCliente || ""}`.trim();
  const telefono = (cliente?.telefono || "").toString().trim();

  if (!nombreDestinatario) {
    throw new Error("No pudimos obtener tu nombre para el envío");
  }

  if (!telefono || telefono.length < 8) {
    throw new Error(
      "Necesitas un teléfono válido en tu perfil para usar envío a domicilio",
    );
  }

  const direccionTexto = [
    `${direccion.calle} ${direccion.numero}`,
    direccion.piso ? `Piso ${direccion.piso}` : "",
    direccion.departamento ? `Depto ${direccion.departamento}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    nombreDestinatario,
    telefono,
    direccion: direccionTexto,
    ciudad: direccion.localidad,
    provincia: direccion.provincia,
    codigoPostal: direccion.codigoPostal,
    referencias: direccion.referencias || "",
  };
};

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
        tipoEntrega: "Sucursal",
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

      await axios.post(`${API_BASE_URL}/ventaOnline/crear`, compra);

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

  realizarCompraCarrito: async (
    metodoPago,
    tipoEntrega = "Sucursal",
    direccionEnvio = null,
  ) => {
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
      const { token } = useAuthStore.getState();

      if (carrito.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Tu carrito está vacío",
          text: "Agrega productos antes de comprar.",
        });
        return;
      }

      const totalPago = carrito.reduce(
        (acc, prod) => acc + prod.precio * prod.cantidad,
        0,
      );

      let direccionEnvioFinal = direccionEnvio;
      if (tipoEntrega === "Envio" && !direccionEnvioFinal) {
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Sesión inválida",
            text: "Inicia sesión nuevamente para completar el envío.",
          });
          return;
        }

        try {
          direccionEnvioFinal = await construirDireccionEnvioDesdePerfil(
            idCliente,
            token,
          );
        } catch (error) {
          Swal.fire({
            icon: "warning",
            title: "No pudimos usar tu dirección predeterminada",
            text:
              error?.response?.data?.error ||
              error?.message ||
              "Configura una dirección predeterminada en tu perfil.",
          });
          return;
        }
      }

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
        direccionEnvio: tipoEntrega === "Envio" ? direccionEnvioFinal : null,
      };

      await axios.post(`${API_BASE_URL}/ventaOnline/crear`, compra);

      // Marcar receta como usada si corresponde
      for (const prod of carrito) {
        if (prod.categoria === "Medicamentos con Receta" && prod.idReceta) {
          await marcarRecetaUsada(prod.idReceta, token);
        }
      }

      await axios.delete(`${API_BASE_URL}/carrito/vaciar/${idCliente}`);
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
  },
}));
