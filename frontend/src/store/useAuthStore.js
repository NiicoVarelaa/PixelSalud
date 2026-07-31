import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
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
          refreshToken: data.refreshToken || null,
        });
      },
      updateTokens: (token, refreshToken) => {
        set({ token, refreshToken: refreshToken || null });
      },
      logoutUser: () => {
        set({ user: null, token: null, refreshToken: null });
      },
    }),
    {
      name: "auth",
      getStorage: () => localStorage,
    },
  ),
);
