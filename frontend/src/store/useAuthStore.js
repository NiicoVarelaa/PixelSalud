import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null, // Estado para guardar el token JWT

      // ACCIÓN DE LOGIN ACTUALIZADA
      loginUser: (data) => {
        console.log("Data completa recibida en login:", data);
        console.log("Guardando data de login en el store:", data);
        set({
          user: {
            id: data.id || data.idCliente,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            rol: data.rol,
            tipo: data.tipo,
            permisos: data.permisos
          },
          token: data.token, // GUARDAMOS EL TOKEN
        });
      },

      // ACCIÓN DE LOGOUT
      logoutUser: () => {
        console.log("Cerrando sesión, limpiando usuario y token.");
        set({
          user: null,
          token: null, // LIMPIAMOS EL TOKEN
        });
      },
    }),
    {
      // CONFIGURACIÓN DE PERSISTENCIA
      name: "auth-storage",

      // 1. Especificamos el mecanismo de almacenamiento: sessionStorage
      getStorage: () => sessionStorage,
      // 2. Definimos qué partes del estado queremos persistir
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
