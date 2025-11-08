import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null, 
      loginUser: (data) => {
        console.log("Data completa recibida en login:", data); // <-- ¡Este log ahora te va a mostrar los permisos!
        set({
          user: {
            id: data.id || data.idCliente,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            rol: data.rol,
            permisos: data.permisos, // <-- ¡LA LÍNEA MÁGICA!
            tipo: data.tipo,
          },
          token: data.token,
        });
      },
      logoutUser: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      // Si querés que sea en Local Storage (para que no se borre al cerrar la pestaña), dejalo así:
      // getStorage: () => localStorage, // (o borrá la línea 'getStorage' entera, que es el default)

      // Si querés que SÍ se borre al cerrar (como decía tu código), dejalo así:
      getStorage: () => sessionStorage,
    }
  )
);