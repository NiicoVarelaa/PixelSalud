import { create } from "zustand";
import axios from "axios";

export const useClienteStore = create((set) => ({
  cliente: null,

  // Obtener el cliente logueado
  getCliente: async () => {
    try {
      const usuariosResponse = await axios.get("http://localhost:5000/clientes");
      const usuarios = usuariosResponse.data;
      const usuarioLogueado = usuarios.find((user) => user.logueado === 1);

      if (!usuarioLogueado) {
        console.log("Usuario no encontrado o logueado.");
        set({ cliente: null });
        return null;
      }

      set({ cliente: usuarioLogueado });
      return usuarioLogueado;
    } catch (error) {
      console.error("Error al obtener cliente logueado:", error);
      set({ cliente: null });
      return null;
    }
  },

  // Setear cliente manualmente
  setCliente: (cliente) => set({ cliente }),

  // Logout del cliente
  logoutCliente: async (idCliente) => {
    try {
      await axios.put(`http://localhost:5000/clientes/${idCliente}/logout`);
      set({ cliente: null });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  },
}));
