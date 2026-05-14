import apiClient from "../utils/apiClient";
import { useAuthStore } from "../store/useAuthStore";

export const logout = async () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  try {
    await apiClient.post("/auth/logout", { refreshToken });
  } catch (error) {
    console.error("Error al cerrar sesión en el servidor:", error);
  } finally {
    useAuthStore.getState().logoutUser();
  }
};

export const logoutAllSessions = async () => {
  try {
    await apiClient.post("/auth/logout-all");
    useAuthStore.getState().logoutUser();
  } catch (error) {
    console.error("Error al cerrar todas las sesiones:", error);
    useAuthStore.getState().logoutUser();
  }
};
