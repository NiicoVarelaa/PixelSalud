import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loginUser: (data) => {
        set({
          user: {
            id: data.id || data.idCliente,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            rol: data.rol,
            permisos: data.permisos, 
            tipo: data.tipo,
            dni: data.dni,
          },
          token: data.token,
        });
      },
      logoutUser: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth",
      getStorage: () => sessionStorage,
    }
  )
);
