import { Percent } from "lucide-react";
import { Link } from "react-router-dom";

const LoyaltyCard = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:row-span-2 flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group">
    <div className="p-6 md:p-8 flex flex-col items-center justify-center flex-1">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-20"></div>
        <div className="relative rounded-full p-4 border-2 border-green-700 shadow-lg transform group-hover:scale-110 transition-transform duration-300 bg-white">
          <Percent 
            className="h-12 w-12 md:h-14 md:w-14 text-green-600"
            strokeWidth={1.5}
          />
        </div>
      </div>
      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gray-900">
        ¡Registrate y obtené <span className="text-green-700">10% OFF</span>!
      </h3>
      <p className="text-gray-700 text-lg text-center mb-8 leading-relaxed">
        Creá tu cuenta y recibí un 10% de descuento en tu primera compra online.
      </p>
      <Link
        to="/registro"
        className="inline-flex items-center justify-center gap-3 text-white font-bold py-2.5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl w-full"
      >
        Registrarme
      </Link>
      <p className="text-green-700 text-sm font-medium mt-4">
        Promoción válida solo para nuevos usuarios.
      </p>
    </div>
  </div>
);

export default LoyaltyCard;