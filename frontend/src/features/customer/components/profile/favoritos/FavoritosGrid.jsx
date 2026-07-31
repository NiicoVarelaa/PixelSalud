import { motion } from "framer-motion";
import Pagination from "@features/admin/components/products/components/Pagination";
import { CardProductos } from "@features/customer/components/products";

const FavoritosGrid = ({
  productos,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-20 md:pb-2">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productos.map((favorito, index) => (
          <motion.div
            key={favorito.idProducto}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.03 * index }}
            className="transform rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <CardProductos product={favorito} />
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pb-1">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default FavoritosGrid;
