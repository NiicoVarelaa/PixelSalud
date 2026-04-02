import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import { useFavoritosStore } from "@store/useFavoritoStore";
import { usePagination } from "@features/admin/components/products/hooks/usePagination";

const usePerfilFavoritos = () => {
  const { user } = useAuthStore();
  const { favoritos, getFavoritos, isLoading } = useFavoritosStore();
  const navigate = useNavigate();

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(
    favoritos,
    7,
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    getFavoritos();
  }, [user, getFavoritos, navigate]);

  return {
    isLoading,
    favoritos,
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
  };
};

export default usePerfilFavoritos;
