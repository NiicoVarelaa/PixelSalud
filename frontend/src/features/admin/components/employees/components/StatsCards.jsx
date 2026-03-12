import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

/**
 * Tarjetas de estadísticas animadas para empleados
 */
export const StatsCards = ({ estadisticas }) => {
  const stats = [
    {
      titulo: "Total Empleados",
      valor: estadisticas.total,
      icono: Users,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      titulo: "Activos",
      valor: estadisticas.activos,
      icono: UserCheck,
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      titulo: "Inactivos",
      valor: estadisticas.inactivos,
      icono: UserX,
      color: "from-red-500 to-red-600",
      bgLight: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      titulo: "Con Permisos Crear",
      valor: estadisticas.conPermisoCrear,
      icono: Shield,
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icono;
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${stat.color} p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium opacity-90">
                    {stat.titulo}
                  </p>
                  <p className="text-white text-3xl font-bold mt-1">
                    {stat.valor}
                  </p>
                </div>
                <div className={`${stat.bgLight} p-3 rounded-lg`}>
                  <Icon className={stat.textColor} size={28} strokeWidth={2} />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
