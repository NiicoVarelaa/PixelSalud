import { Star, Gift } from "lucide-react"; 
import { Link } from "react-router-dom";

const LoyaltyCard = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:row-span-2 flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group">
    <div className="p-6 md:p-8 flex flex-col items-center justify-center flex-1">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-pulse opacity-20"></div>
        <div className="relative rounded-full p-4 border-2 border-yellow-700 shadow-lg transform group-hover:scale-110 transition-transform duration-300 bg-white">
          <Star 
            className="h-12 w-12 md:h-14 md:w-14 text-yellow-600"
            fill="#FBBF24" 
            strokeWidth={1.5}
          />
        </div>
      </div>
      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gray-900">
        Acumula <span className="text-yellow-700">Puntos</span>
      </h3>
      <p className="text-gray-700 text-lg text-center mb-8 leading-relaxed">
        Gana puntos con cada compra y canjéalos por descuentos exclusivos en tus productos favoritos.
      </p>
      <Link
        to="/perfil"
        className="inline-flex items-center justify-center gap-3 text-white font-bold py-2.5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 shadow-lg hover:shadow-xl w-full"
      >
        <Gift className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        Beneficios
      </Link>
      <p className="text-yellow-700 text-sm font-medium mt-4">
        Sé parte del Club Pixel
      </p>
    </div>
  </div>
);

export default LoyaltyCard;