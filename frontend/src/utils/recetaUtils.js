import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function marcarRecetaUsada(idReceta, token) {
  try {
    await axios.put(
      `${API_BASE_URL}/recetas/usada/${idReceta}`,
      {},
      { headers: { Auth: `Bearer ${token}` } },
    );
    return true;
  } catch (err) {
    console.error("Error al marcar receta como usada", err);
    return false;
  }
}
