import apiClient from "@utils/apiClient";

export const carritoService = {
  getSincronizar: async (idCliente) => {
    const { data } = await apiClient.get(`/carrito/${idCliente}`);
    return data;
  },

  agregar: async (idProducto, idCliente) => {
    await apiClient.post("/carrito/agregar", { idProducto, idCliente });
  },

  eliminar: async (idCliente, idProducto) => {
    await apiClient.delete(`/carrito/eliminar/${idCliente}/${idProducto}`);
  },

  vaciar: async (idCliente) => {
    await apiClient.delete(`/carrito/vaciar/${idCliente}`);
  },

  aumentarCantidad: async (idProducto, idCliente) => {
    await apiClient.put("/carrito/aumentar", { idProducto, idCliente });
  },

  disminuirCantidad: async (idProducto, idCliente) => {
    await apiClient.put("/carrito/disminuir", { idProducto, idCliente });
  },
};
