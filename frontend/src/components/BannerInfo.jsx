import { Link } from "react-router-dom";
import { ShoppingCart, CreditCard, Calendar, ArrowRight } from "lucide-react";

const BannerInfo = () => {
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-around items-center bg-white rounded-xl shadow-md p-6 space-y-6 md:space-y-0 md:space-x-4">        
        <div className="flex flex-col items-center text-center space-y-3 w-full md:w-1/3">
          <div className="p-3 rounded-full flex-shrink-0 bg-primary-100">
            <ShoppingCart className="h-6 w-6 text-primary-700" />
          </div>
          <div>
            <p className="text-gray-800 font-semibold">¿Cómo comprar?</p>
            <Link
              to="/Error404"
              className="group text-sm font-medium text-primary-700 flex items-center justify-center space-x-1"
            >
              <span>Enterate acá</span>
              <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="hidden md:block border-l border-gray-200 h-16"></div>

        <div className="flex flex-col items-center text-center space-y-3 w-full md:w-1/3">
          <div className="p-3 rounded-full flex-shrink-0 bg-primary-100">
            <CreditCard className="h-6 w-6 text-primary-700" />
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Medios de pago</p>
            <Link
              to="/Error404"
              className="group text-sm font-medium text-primary-700 flex items-center justify-center space-x-1"
            >
              <span>Ver más</span>
              <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="hidden md:block border-l border-gray-200 h-16"></div>

        <div className="flex flex-col items-center text-center space-y-3 w-full md:w-1/3">
          <div className="p-3 rounded-full flex-shrink-0 bg-primary-100">
            <Calendar className="h-6 w-6 text-primary-700" />
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Retirá tu pedido gratis</p>
            <Link
              to="/Error404"
              className="group text-sm font-medium text-primary-700 flex items-center justify-center space-x-1"
            >
              <span>Ver puntos</span>
              <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerInfo;
