import axios from "axios";

export async function marcarRecetaUsada(idReceta, token) {
  try {
    await axios.put(
      `http://localhost:5000/recetas/usada/${idReceta}`,
      {},
      { headers: { Auth: `Bearer ${token}` } }
    );
    return true;
  } catch (err) {
    console.error("Error al marcar receta como usada", err);
    return false;
  }
}
