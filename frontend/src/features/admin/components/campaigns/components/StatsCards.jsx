import { Tag, Zap, PowerOff, Package } from "lucide-react";

const STATS = (campanas, productos) => [
  {
    label: "Campañas",
    value: campanas.length,
    icon: Tag,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-700",
  },
  {
    label: "Activas",
    value: campanas.filter((c) => c.esActiva).length,
    icon: Zap,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Inactivas",
    value: campanas.filter((c) => !c.esActiva).length,
    icon: PowerOff,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    label: "Productos",
    value: productos.length,
    icon: Package,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

export const StatsCards = ({ campanas, productos }) => {
  const stats = STATS(campanas, productos);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:border-gray-200 transition-colors"
          >
            <div className={`${stat.iconBg} p-2.5 rounded-lg shrink-0`}>
              <Icon className={stat.iconColor} size={22} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
