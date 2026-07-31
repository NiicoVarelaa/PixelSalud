import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

export const StatsCards = ({ estadisticas }) => {
  const stats = [
    {
      titulo: "Total Clientes",
      valor: estadisticas.total,
      icono: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      titulo: "Activos",
      valor: estadisticas.activos,
      icono: UserCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      titulo: "Inactivos",
      valor: estadisticas.inactivos,
      icono: UserX,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      titulo: "Tasa Activos",
      valor:
        estadisticas.total > 0
          ? `${Math.round((estadisticas.activos / estadisticas.total) * 100)}%`
          : "0%",
      icono: TrendingUp,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 lg:mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icono;
        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:border-gray-200 transition-colors"
          >
            <div
              className={`${stat.iconBg} p-2.5 rounded-lg shrink-0`}
            >
              <Icon className={stat.iconColor} size={22} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {stat.titulo}
              </p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">
                {stat.valor}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
