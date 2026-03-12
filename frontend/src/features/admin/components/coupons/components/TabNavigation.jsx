import { motion } from "framer-motion";

export const TabNavigation = ({
  vistaActual,
  setVistaActual,
  totalCupones,
}) => {
  const tabs = [
    { id: "cupones", label: `Cupones (${totalCupones})` },
    { id: "historial", label: "Historial de Uso" },
  ];

  return (
    <div className="flex gap-2 mb-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setVistaActual(tab.id)}
          className={`px-6 py-3 font-medium transition-colors relative ${
            vistaActual === tab.id
              ? "text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
          {vistaActual === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
