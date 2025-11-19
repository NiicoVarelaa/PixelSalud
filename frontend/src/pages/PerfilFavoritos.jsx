import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useFavoritosStore } from "../store/useFavoritoStore";
import { Link, useNavigate } from "react-router-dom"; 
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import CardProductos from "../components/CardProductos";

const PerfilFavoritos = () => {
  const { user } = useAuthStore();
  const { favoritos, getFavoritos, isLoading } = useFavoritosStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    getFavoritos();
  }, [user, getFavoritos, navigate]);

  if (isLoading) { 
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Cargando tus favoritos...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
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
      </div>
      
      {favoritos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoritos.map((favorito) => (
            <div 
              key={favorito.idProducto} 
              className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl"
            >
              <CardProductos product={favorito} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center mt-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Heart className="text-rose-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Tu lista de deseos está vacía</h3>
          <p className="text-slate-500 mt-2 mb-8 max-w-xs mx-auto leading-relaxed">
            Guarda aquí los productos que te encantan para no perderlos de vista.
          </p>
          <Link 
            to="/productos" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 active:scale-95"
          >
            Explorar Tienda <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default PerfilFavoritos;