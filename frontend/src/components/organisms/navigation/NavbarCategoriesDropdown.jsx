import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CATEGORIAS_DATA } from "@data/categoriasData";

export function NavbarCategoriesDropdown({
  isCategoriasOpen,
  setIsCategoriasOpen,
  categoriasRef,
  handleCategoriaClick,
}) {
  return (
    <li className="relative" ref={categoriasRef}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsCategoriasOpen((prev) => !prev)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer align-middle ${
          isCategoriasOpen
            ? "bg-primary-50 text-primary-700"
            : "hover:text-primary-700"
        }`}
        aria-haspopup="true"
        aria-expanded={isCategoriasOpen}
        aria-label="Abrir menú de categorías"
        tabIndex={0}
      >
        <span className="font-medium">CATEGORÍAS</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isCategoriasOpen ? "rotate-180" : ""}`}
        />
      </motion.button>
      <AnimatePresence>
        {isCategoriasOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-visible animate-in fade-in-0 zoom-in-95 duration-200"
            role="menu"
            aria-label="Lista de categorías"
          >
            {CATEGORIAS_DATA.map((categoria, index) => (
              <div key={categoria.text}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCategoriaClick(categoria.link)}
                  className="w-full text-left px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group cursor-pointer"
                  role="menuitem"
                  tabIndex={0}
                >
                  <span className="text-sm font-medium">{categoria.text}</span>
                  <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400 group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all" />
                </motion.button>
                {index < CATEGORIAS_DATA.length - 1 && (
                  <div className="mx-3 my-1 border-t border-gray-100" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
