import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const MisComprasEmptyState = () => {
  return (
    <div className="grid flex-1 place-content-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-10">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
        <ShoppingBag className="text-primary-500" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">
        No tienes pedidos aún
      </h3>
      <p className="mx-auto mb-6 mt-2 max-w-xs text-slate-500">
        Parece que no has realizado ninguna compra. ¡Explora nuestra tienda!
      </p>
      <Link
        to="/productos"
        className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-primary-600/30 active:scale-95"
      >
        Ir a la tienda <ArrowRight size={18} />
      </Link>
    </div>
  );
};

export default MisComprasEmptyState;
