import { Frown } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { CardSkeleton } from "@components/molecules/cards";
import { CardProductos } from "@features/customer/components/products";
import { useAuthStore } from "@store/useAuthStore";

export const ProductGrid = ({
  isLoading,
  productos,
  esCategoriaReceta,
  user,
  recetaBuscada,
  recetasActivas,
  setShowModalRecetas,
  setRecetasActivas,
  setRecetaBuscada,
}) => {
  const token = useAuthStore((state) => state.token);
  const [isSearchingReceta, setIsSearchingReceta] = useState(false);
  const [recetaError, setRecetaError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleBuscarReceta = async () => {
    setIsSearchingReceta(true);
    setRecetaError("");

    if (!user?.dni) {
      setRecetaError(
        "No se encontró el DNI del usuario. Por favor, vuelve a iniciar sesión.",
      );
      setIsSearchingReceta(false);
      return;
    }

    try {
      const res = await axios.get(`${apiUrl}/recetas/cliente/${user.dni}`, {
        headers: { Auth: `Bearer ${token}` },
      });

      if (res.data && res.data.length > 0) {
        setRecetasActivas(res.data);
        setRecetaBuscada(true);
        setShowModalRecetas(true);
      } else {
        setRecetaError("No tienes recetas activas");
        setRecetasActivas([]);
        setRecetaBuscada(true);
      }
    } catch (error) {
      setRecetaError("Error al buscar receta");
      setRecetasActivas([]);
      setRecetaBuscada(true);
      console.error("Error al buscar receta:", error);
    } finally {
      setIsSearchingReceta(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (
    productos.length === 0 ||
    (esCategoriaReceta &&
      (!user || !recetaBuscada || recetasActivas.length === 0))
  ) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center w-full">
        <Frown className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">
          {esCategoriaReceta
            ? user
              ? recetaBuscada
                ? "No tienes recetas activas"
                : "Debes buscar tu receta"
              : "Debes iniciar sesión para ver medicamentos con receta"
            : "No se encontraron productos"}
        </h3>
        <p className="text-gray-500 text-sm">
          {esCategoriaReceta
            ? "Solo puedes comprar medicamentos con receta si tienes una receta activa."
            : "Prueba cambiando los filtros o el término de búsqueda."}
        </p>
        {!user && esCategoriaReceta && (
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors cursor-pointer"
          >
            Iniciar sesión
          </button>
        )}
        {!recetaBuscada && user && esCategoriaReceta && (
          <div className="my-4 flex flex-col items-center">
            <button
              onClick={handleBuscarReceta}
              disabled={isSearchingReceta}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold shadow hover:bg-primary-700 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSearchingReceta ? "Buscando..." : "Buscar mi receta"}
            </button>
            {recetaError && (
              <p className="text-red-500 mt-2 text-sm">{recetaError}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (recetaBuscada && recetasActivas.length > 0 && user && esCategoriaReceta) {
    return (
      <div className="flex justify-center my-8">
        <button
          onClick={() => setShowModalRecetas(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold shadow hover:bg-primary-700 transition cursor-pointer"
        >
          Ver Receta
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 xl:gap-8 gap-6">
      {productos.map((p) => (
        <CardProductos key={p.idProducto} product={p} />
      ))}
    </div>
  );
};
