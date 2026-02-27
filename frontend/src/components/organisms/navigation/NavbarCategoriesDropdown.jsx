import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CATEGORIAS_DATA } from "@data/categoriasData";
import { useState } from "react";

export function NavbarCategoriesDropdown({
  isCategoriasOpen,
  setIsCategoriasOpen,
  categoriasRef,
  handleCategoriaClick,
  mobileMode = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Versión desktop (sin cambios)
  if (!mobileMode) {
    return (
      <li className="relative" ref={categoriasRef}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsCategoriasOpen((prev) => !prev)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
            isCategoriasOpen
              ? "bg-primary-50 text-primary-700"
              : "hover:text-primary-700"
          }`}
          aria-haspopup="true"
          aria-expanded={isCategoriasOpen}
          aria-label="Abrir menú de categorías"
        >
          <span className="font-medium">CATEGORÍAS</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isCategoriasOpen ? "rotate-180" : ""
            }`}
          />
        </motion.button>
        <AnimatePresence>
          {isCategoriasOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full left-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
              role="menu"
              aria-label="Lista de categorías"
            >
              {CATEGORIAS_DATA.map((categoria, index) => (
                <div key={categoria.text}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleCategoriaClick(categoria.link)}
                    className="w-full text-left px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group"
                    role="menuitem"
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

  // Versión mobile con mejoras:
  // - Texto en mayúsculas
  // - Línea verde más oscura cuando está expandido
  return (
    <div className="w-full" ref={categoriasRef}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-3 px-1 rounded-md text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        aria-expanded={isExpanded}
        aria-controls="categorias-submenu"
      >
        <span className="uppercase">Categorías</span> {/* 1. Mayúsculas */}
        <motion.span
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="categorias-submenu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`overflow-hidden pl-4 ml-1 mt-1 border-l-2 ${
              isExpanded ? "border-primary-600" : "border-primary-100" 
            }`}
          >
            {CATEGORIAS_DATA.map((categoria) => (
              <button
                key={categoria.text}
                onClick={() => {
                  handleCategoriaClick(categoria.link);
                  setIsExpanded(false);
                }}
                className="block w-full text-left py-2 px-2 text-sm text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {categoria.text}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}