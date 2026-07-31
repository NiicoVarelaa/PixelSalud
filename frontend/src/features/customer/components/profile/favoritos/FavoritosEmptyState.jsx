import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const FavoritosEmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.06 }}
      className="mt-1 grid flex-1 place-content-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 shadow-sm">
        <Heart className="text-rose-400" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">
        Tu lista de deseos esta vacia
      </h3>
      <p className="mx-auto mt-2 mb-8 max-w-xs leading-relaxed text-slate-500">
        Guarda aqui los productos que te encantan para no perderlos de vista.
      </p>
      <Link
        to="/productos"
        className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-medium text-white shadow-lg shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-primary-600/30 active:scale-95"
      >
        Explorar Tienda <ArrowRight size={18} />
      </Link>
    </motion.div>
  );
};

export default FavoritosEmptyState;
