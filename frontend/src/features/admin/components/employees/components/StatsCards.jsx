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
      accent: "text-gray-700",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      titulo: "Activos",
      valor: estadisticas.activos,
      icono: UserCheck,
      accent: "text-green-700",
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
    },
    {
      titulo: "Inactivos",
      valor: estadisticas.inactivos,
      icono: UserX,
      accent: "text-orange-700",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
    },
    {
      titulo: "Permisos de Gestión",
      valor: estadisticas.conPermisoCrear,
      icono: Shield,
      accent: "text-green-700",
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
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
      className="grid grid-cols-2 gap-3 xl:grid-cols-4"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icono;
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-500">
                  {stat.titulo}
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-bold mt-1 ${stat.accent}`}
                >
                  {stat.valor}
                </p>
              </div>
              <div className={`${stat.iconBg} p-2.5 rounded-lg`}>
                <Icon className={stat.iconColor} size={20} strokeWidth={2.2} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
