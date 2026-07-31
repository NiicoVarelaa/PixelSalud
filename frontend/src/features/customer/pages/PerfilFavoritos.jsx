import { motion } from "framer-motion";
import usePerfilFavoritos from "@features/customer/hooks/usePerfilFavoritos";
import {
  FavoritosEmptyState,
  FavoritosGrid,
  FavoritosHeader,
  FavoritosLoading,
} from "@features/customer/components/profile/favoritos";

const PerfilFavoritos = () => {
  const {
    favoritos,
    isLoading,
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
  } = usePerfilFavoritos();

  if (isLoading) {
    return <FavoritosLoading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="mx-auto flex h-full min-h-0 max-w-4xl flex-col pt-4"
    >
      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.22 }}
        className="shrink-0 border-b border-slate-100 pb-4"
      >
        <FavoritosHeader />
      </motion.div>

      {favoritos.length > 0 ? (
        <FavoritosGrid
          productos={paginatedItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      ) : (
        <FavoritosEmptyState />
      )}
    </motion.div>
  );
};

export default PerfilFavoritos;
