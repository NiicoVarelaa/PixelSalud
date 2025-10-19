import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      // ESTADO: 'user' puede ser un cliente, empleado, admin, o null si nadie está logueado.
      user: null,

      // ACCIÓN: Se llama desde el componente Login cuando el inicio de sesión es exitoso.
      loginUser: (userData) => {
        console.log("Guardando usuario en el store:", userData);
        set({ user: userData });
      },

      // ACCIÓN: Se llama desde el botón de "Cerrar Sesión".
      // Ya no necesita una llamada a la API.
      logoutUser: () => {
        console.log("Cerrando sesión y limpiando el store.");
        set({ user: null });
      },
    }),
    {
      // CONFIGURACIÓN: El store se guardará en localStorage bajo el nombre 'auth-storage'.
      name: "auth-storage",
      // Solo guardamos el objeto 'user'.
      partialize: (state) => ({ user: state.user }),
    }
  )
);