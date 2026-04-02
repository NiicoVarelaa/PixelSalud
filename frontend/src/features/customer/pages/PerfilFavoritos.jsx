import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@store/useAuthStore";
import { useFavoritosStore } from "@store/useFavoritoStore";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { CardProductos } from "@features/customer/components/products";
import Pagination from "@features/admin/components/products/components/Pagination";
import { usePagination } from "@features/admin/components/products/hooks/usePagination";

const PerfilFavoritos = () => {
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

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">
          Cargando tus favoritos...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-7xl mx-auto h-full min-h-0 flex flex-col"
    >
      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.22 }}
        className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4 shrink-0"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Mis Favoritos
            <Heart className="text-rose-500 fill-rose-500" size={24} />
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Colección personal de productos guardados.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-1.5 rounded-full text-sm font-semibold self-start sm:self-auto">
          <Sparkles size={14} />
          {favoritos.length} guardados
        </div>
      </motion.div>

      {favoritos.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedItems.map((favorito, index) => (
              <motion.div
                key={favorito.idProducto}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.03 * index }}
                className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl"
              >
                <CardProductos product={favorito} />
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pb-1">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.06 }}
          className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center mt-1 flex-1 grid place-content-center"
        >
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Heart className="text-rose-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Tu lista de deseos está vacía
          </h3>
          <p className="text-slate-500 mt-2 mb-8 max-w-xs mx-auto leading-relaxed">
            Guarda aquí los productos que te encantan para no perderlos de
            vista.
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 active:scale-95"
          >
            Explorar Tienda <ArrowRight size={18} />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PerfilFavoritos;
