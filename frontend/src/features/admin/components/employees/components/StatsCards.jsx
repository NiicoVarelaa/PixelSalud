import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

const STATS = (e) => [
  {
    label: "Total",
    value: e.total,
    icon: Users,
    accent: "text-gray-700",
    iconBg: "bg-gray-100",
  },
  {
    label: "Activos",
    value: e.activos,
    icon: UserCheck,
    accent: "text-green-700",
    iconBg: "bg-green-100",
  },
  {
    label: "Inactivos",
    value: e.inactivos,
    icon: UserX,
    accent: "text-orange-600",
    iconBg: "bg-orange-50",
  },
  {
    label: "Con acceso",
    value: e.conPermisoCrear,
    icon: Shield,
    accent: "text-green-700",
    iconBg: "bg-green-100",
  },
];

export const StatsCards = ({ estadisticas }) => (
  <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
    {STATS(estadisticas).map((stat, i) => (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.06 }}
        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 shadow-xs"
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
        >
          <stat.icon size={15} className={stat.accent} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 truncate">{stat.label}</p>
          <p className={`text-xl font-bold leading-none mt-0.5 ${stat.accent}`}>
            {stat.value ?? 0}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
);
