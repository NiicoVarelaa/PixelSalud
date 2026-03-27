import { Search, X } from "lucide-react";
import SearchSuggestions from "../search/SearchSuggestions";

export function NavbarSearchDesktop({
  handleSearch,
  searchTerm,
  setSearchTerm,
  setShowSuggestions,
  showSuggestions,
  suggestedProducts,
  handleCloseSuggestions,
  isLoadingSuggestions,
  searchDesktopRef,
}) {
  const handleClear = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="hidden md:flex flex-1 max-w-2xl mx-4 relative"
      role="search"
      aria-label="Buscar productos"
    >
      <div className="relative w-full" ref={searchDesktopRef}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 3 && setShowSuggestions(true)}
          placeholder="Buscá por producto, marca o categoría..."
          className="w-full px-4 py-2 pr-14 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent cursor-text"
          aria-label="Buscar productos, marcas o categorías"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 rounded-md transition-colors cursor-pointer me-2"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-primary-700 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
          aria-label="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>

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
  );
}
