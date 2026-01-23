import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";

const PrescriptionCard = () => (
  <div className="bg-linear-to-br from-secondary-50 to-secondary-100 rounded-2xl shadow-lg overflow-hidden md:col-span-2 flex flex-col lg:flex-row transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group">
    <div className="flex items-center justify-center p-6 lg:w-2/5 bg-linear-to-br from-secondary-600 to-secondary-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.3)_0%,transparent_50%)] opacity-10"></div>
      <FileText 
        className="h-28 w-28 md:h-36 md:w-36 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-500"
        strokeWidth={1.5}
      />
    </div>
    <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 leading-tight">
        Medicamentos con <span className="text-secondary-700">Recetas</span>
      </h3>
      <p className="text-gray-700 text-lg md:text-xl font-medium mb-6 leading-relaxed">
        Compra tus medicamentos con receta y retíralos en tienda
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/productos?categoria=Medicamentos con Receta"
          className="inline-flex items-center justify-center gap-2 text-white font-bold py-2.5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-linear-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 shadow-lg hover:shadow-xl"
        >
          Buscar<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  </div>
);

export default PrescriptionCard;