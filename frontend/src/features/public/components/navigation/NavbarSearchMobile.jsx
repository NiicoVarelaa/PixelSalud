import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SearchSuggestions from "../search/SearchSuggestions";

export function NavbarSearchMobile({
  isSearchOpen,
  handleSearch,
  searchTerm,
  setSearchTerm,
  setShowSuggestions,
  showSuggestions,
  suggestedProducts,
  handleCloseSuggestions,
  isLoadingSuggestions,
  searchMobileRef,
  handleCloseMobileSearch,
}) {
  const handleClear = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.22 }}
          className="md:hidden border-t border-gray-100 py-3 animate-in slide-in-from-top-2 duration-200"
        >
          <form
            onSubmit={handleSearch}
            role="search"
            aria-label="Buscar productos"
          >
            <div className="relative w-full" ref={searchMobileRef}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() =>
                  searchTerm.length >= 3 && setShowSuggestions(true)
                }
                placeholder="Buscá por producto..."
                className="w-full px-4 py-2 pr-16 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent cursor-text"
                autoFocus
                aria-label="Buscar productos, marcas o categorías"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-9 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  aria-label="Limpiar texto"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.08 }}
                type="button"
                onClick={handleCloseMobileSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                aria-label="Cerrar búsqueda"
                tabIndex={0}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>

              {showSuggestions && (
                <SearchSuggestions
                  searchTerm={searchTerm}
                  productos={suggestedProducts}
                  onClose={handleCloseSuggestions}
                  isLoading={isLoadingSuggestions}
                />
              )}
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
