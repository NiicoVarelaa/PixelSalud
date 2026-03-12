import { FiTag } from "react-icons/fi";

export const LoadingState = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

export const EmptyState = ({ mensaje = "No se encontraron cupones" }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <FiTag className="w-16 h-16 text-gray-300 mb-4" />
    <p className="text-gray-500 text-lg">{mensaje}</p>
  </div>
);
