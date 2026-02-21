import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@store/useAuthStore";

const BuscarRecetaButton = ({ onRecetaEncontrada }) => {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuscarReceta = async () => {
    setLoading(true);
    setError("");
    console.log("[FRONTEND] user:", user);
    if (!user?.dni) {
      setError(
        "No se encontró el DNI del usuario. Por favor, vuelve a iniciar sesión.",
      );
      setLoading(false);
      return;
    }
    try {
      const dniCliente = user.dni;
      console.log("[FRONTEND] Buscando recetas con dniCliente:", dniCliente);
      const res = await axios.get(
        `http://localhost:5000/recetas/cliente/${dniCliente}`,
        { headers: { Auth: `Bearer ${token}` } },
      );
      if (res.data && res.data.length > 0) {
        onRecetaEncontrada(res.data);
      } else {
        setError("No tienes recetas activas");
        onRecetaEncontrada([]);
      }
    } catch (err) {
      setError("Error al buscar receta");
      onRecetaEncontrada([]);
    }
    setLoading(false);
  };

  return (
    <div className="my-4 flex flex-col items-center">
      <button
        onClick={handleBuscarReceta}
        disabled={loading}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold shadow hover:bg-primary-700 transition cursor-pointer"
      >
        {loading ? "Buscando..." : "Buscar mi receta"}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default BuscarRecetaButton;
