import { create } from "zustand";
// Importamos el middleware persist
import { persist } from "zustand/middleware"; 
import axios from "axios";

// 1. Definimos el store con create() y envolvemos el contenido con persist()
export const useClienteStore = create(
  persist(
    (set) => ({
      // ESTADO INICIAL
      cliente: null,

      // Obtener el cliente logueado (Llamada al servidor para verificar si sigue logueado)
      // Esta función se sigue usando en el Navbar para la verificación inicial y evitar tokens viejos
      getCliente: async () => {
        // En este punto, 'cliente' ya tiene el valor de localStorage, 
        // por lo que no hay parpadeo de Acceso Denegado.

        try {
          const usuariosResponse = await axios.get("http://localhost:5000/clientes");
          const usuarios = usuariosResponse.data;
          
          // La lógica de tu backend sigue siendo buscar el campo logueado = 1
          const usuarioLogueado = usuarios.find((user) => user.logueado === 1);

          if (!usuarioLogueado) {
            // Si el servidor dice que no está logueado, limpiamos el estado (y localStorage)
            set({ cliente: null });
            return null;
          }

          // Si el servidor confirma, actualizamos el estado.
          set({ cliente: usuarioLogueado });
          return usuarioLogueado;
        } catch (error) {
          console.error("Error al obtener cliente logueado:", error);
          // Si hay un error de red, mantenemos el cliente de localStorage por si acaso.
          return null; 
        }
      },

      // Setear cliente (usado en el login)
      setCliente: (cliente) => set({ cliente }),

      // Logout del cliente
      logoutCliente: async (idCliente) => {
        try {
          await axios.put(`http://localhost:5000/clientes/${idCliente}/logout`);
          // Limpiar el estado de Zustand (persist se encargará de limpiar localStorage)
          set({ cliente: null }); 
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
      },
    }),
    {
      // 2. CONFIGURACIÓN DEL PERSIST MIDDLEWARE
      name: "cliente-storage", // Nombre clave en localStorage
      // Sólo persistimos el objeto 'cliente', ya que las funciones no son necesarias
      partialize: (state) => ({ cliente: state.cliente }), 
    }
  )
);