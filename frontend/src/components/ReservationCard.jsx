import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

const ReservationCard = () => (
  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl shadow-lg overflow-hidden md:col-span-3 lg:col-span-2 xl:col-span-2 flex flex-col lg:flex-row transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group">
    <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900 leading-tight">
        Compra tus <span className="text-primary-700">Medicamentos</span>
      </h2>
      <p className="text-gray-700 text-lg md:text-xl mb-6 font-medium">
        Y retiralos sin hacer fila
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/productos?categoria=Medicamentos Venta Libre"
          className="inline-flex items-center justify-center gap-2 text-white font-bold py-2.5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl"
        >
          Reservar
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
    <div className="flex items-center justify-center p-6 lg:w-2/5 bg-gradient-to-br from-primary-600 to-primary-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.3)_0%,transparent_50%)] opacity-10"></div>
      <CalendarDays
        className="h-28 w-28 md:h-36 md:w-36 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-500"
        strokeWidth={1.5}
      />
    </div>
  </div>
);

export default ReservationCard;