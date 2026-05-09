import { Tag, Percent, TrendingDown, Calculator } from "lucide-react";
import { useMemo } from "react";
import { hasActiveOffer, normalizeDiscount } from "../../utils/ofertasFilters";

export const OfertasStatsCards = ({ productos }) => {
  const stats = useMemo(() => {
    const conOferta = productos.filter((p) => hasActiveOffer(p));
    const sinOferta = productos.length - conOferta.length;
    const descuentos = conOferta.map((p) => normalizeDiscount(p.porcentajeDescuento));
    const promedio = descuentos.length > 0
      ? Math.round(descuentos.reduce((a, b) => a + b, 0) / descuentos.length)
      : 0;

    return [
      {
        titulo: "Total",
        valor: productos.length,
        icono: Tag,
        iconBg: "bg-gray-100",
        iconColor: "text-gray-700",
      },
      {
        titulo: "Con oferta",
        valor: conOferta.length,
        icono: Percent,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        titulo: "Sin oferta",
        valor: sinOferta,
        icono: TrendingDown,
        iconBg: "bg-gray-100",
        iconColor: "text-gray-600",
      },
      {
        titulo: "Desc. promedio",
        valor: `${promedio}%`,
        icono: Calculator,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
    ];
  }, [productos]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
      {stats.map((stat, index) => {
        const Icon = stat.icono;
        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:border-gray-200 transition-colors"
          >
            <div className={`${stat.iconBg} p-2.5 rounded-lg shrink-0`}>
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
