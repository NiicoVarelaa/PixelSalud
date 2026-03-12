import { motion } from "framer-motion";
import { FiTag, FiCheck, FiX, FiClock, FiTrendingUp } from "react-icons/fi";

export const StatsCards = ({ estadisticas }) => {
  const stats = [
    {
      titulo: "Total Cupones",
      valor: estadisticas.total,
      icono: FiTag,
      color: "blue",
      colorClasses: "bg-blue-100 text-blue-600",
    },
    {
      titulo: "Activos",
      valor: estadisticas.activos,
      icono: FiCheck,
      color: "green",
      colorClasses: "bg-green-100 text-green-600",
    },
    {
      titulo: "Inactivos",
      valor: estadisticas.inactivos,
      icono: FiX,
      color: "red",
      colorClasses: "bg-red-100 text-red-600",
    },
    {
      titulo: "Expirados",
      valor: estadisticas.expirados,
      icono: FiClock,
      color: "gray",
      colorClasses: "bg-gray-100 text-gray-600",
    },
    {
      titulo: "Usos Totales",
      valor: estadisticas.vecesUsadoTotal,
      icono: FiTrendingUp,
      color: "purple",
      colorClasses: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.titulo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${stat.colorClasses}`}>
              <stat.icono className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stat.valor}</p>
          <p className="text-sm text-gray-600">{stat.titulo}</p>
        </motion.div>
      ))}
    </div>
  );
};
