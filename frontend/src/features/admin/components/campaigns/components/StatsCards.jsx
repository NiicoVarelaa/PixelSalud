import { motion } from "framer-motion";
import { Tag, Zap, PowerOff, Package } from "lucide-react";

const STATS = (campanas, productos) => [
  {
    label: "Campañas",
    value: campanas.length,
    icon: Tag,
    accent: "text-gray-700",
    iconBg: "bg-gray-100",
  },
  {
    label: "Activas",
    value: campanas.filter((c) => c.esActiva).length,
    icon: Zap,
    accent: "text-green-700",
    iconBg: "bg-green-100",
  },
  {
    label: "Inactivas",
    value: campanas.filter((c) => !c.esActiva).length,
    icon: PowerOff,
    accent: "text-gray-500",
    iconBg: "bg-gray-100",
  },
  {
    label: "Productos",
    value: productos.length,
    icon: Package,
    accent: "text-gray-700",
    iconBg: "bg-gray-100",
  },
];

export const StatsCards = ({ campanas, productos }) => {
  const stats = STATS(campanas, productos);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-xs"
        >
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}>
            <stat.icon size={17} className={stat.accent} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 truncate">{stat.label}</p>
            <p className={`text-xl font-bold leading-none mt-0.5 ${stat.accent}`}>
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
