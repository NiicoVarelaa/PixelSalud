import { motion } from "framer-motion";
import { Tag, Sparkles, Power, Package } from "lucide-react";

export const StatsCards = ({ campanas, productos }) => {
  const stats = [
    {
      label: "Total Campañas",
      value: campanas.length,
      icon: Tag,
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      textColor: "text-blue-600",
      valueColor: "text-blue-700",
      iconColor: "text-blue-400",
    },
    {
      label: "Activas",
      value: campanas.filter((c) => c.esActiva).length,
      icon: Sparkles,
      gradient: "from-green-50 to-green-100",
      border: "border-green-200",
      textColor: "text-green-600",
      valueColor: "text-green-700",
      iconColor: "text-green-400",
    },
    {
      label: "Inactivas",
      value: campanas.filter((c) => !c.esActiva).length,
      icon: Power,
      gradient: "from-red-50 to-red-100",
      border: "border-red-200",
      textColor: "text-red-600",
      valueColor: "text-red-700",
      iconColor: "text-red-400",
    },
    {
      label: "Productos Total",
      value: productos.length,
      icon: Package,
      gradient: "from-purple-50 to-purple-100",
      border: "border-purple-200",
      textColor: "text-purple-600",
      valueColor: "text-purple-700",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-xl border ${stat.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${stat.textColor} text-sm font-medium`}>
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.valueColor} mt-1`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-12 h-12 ${stat.iconColor}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
