import { motion } from "framer-motion";
import { Tag, History } from "lucide-react";

export const TabNavigation = ({
  vistaActual,
  setVistaActual,
  totalCupones,
}) => {
  const tabs = [
    { id: "cupones", label: "Cupones", badge: totalCupones, icon: Tag },
    { id: "historial", label: "Historial de uso", badge: null, icon: History },
  ];

  return (
    <div
      className="flex gap-0.5 rounded-xl border border-gray-200 bg-gray-100 p-0.5"
      role="tablist"
      aria-label="Secciones de cupones"
    >
      {tabs.map((tab) => {
        const active = vistaActual === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setVistaActual(tab.id)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 ${
              active
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon size={13} aria-hidden="true" />
            {tab.label}
            {tab.badge !== null && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {tab.badge}
              </span>
            )}
            {active && (
              <motion.div
                layoutId="cuponTab"
                className="absolute inset-0 rounded-lg bg-white shadow-xs -z-10"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
