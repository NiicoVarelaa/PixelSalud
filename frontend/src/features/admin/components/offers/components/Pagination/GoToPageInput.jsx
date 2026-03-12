import { motion } from "framer-motion";

export const GoToPageInput = ({ totalPaginas, paginaActual, onChange }) => {
  if (totalPaginas <= 5) return null;

  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    if (val >= 1 && val <= totalPaginas) {
      onChange(val);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="hidden lg:flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-200"
    >
      <label htmlFor="goto-page" className="text-sm font-medium text-gray-600">
        Ir a página:
      </label>
      <input
        id="goto-page"
        type="number"
        min={1}
        max={totalPaginas}
        value={paginaActual}
        onChange={handleChange}
        className="
          w-20 h-9 px-3 text-sm text-center font-semibold
          border-2 border-gray-200 rounded-lg
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200
          transition-all
        "
        aria-label="Número de página"
      />
      <span className="text-sm text-gray-500">de {totalPaginas}</span>
    </motion.div>
  );
};
