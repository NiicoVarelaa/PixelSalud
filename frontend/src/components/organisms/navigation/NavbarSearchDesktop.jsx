import { Search } from "lucide-react";
import { SearchSuggestions } from "@components/molecules/search";

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
  return (
    <form
      onSubmit={handleSearch}
      className="hidden md:flex flex-1 max-w-2xl mx-4"
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
          className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          aria-label="Buscar productos, marcas o categorías"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Buscar"
        >
          <Search className="w-5 h-5 text-gray-500" />
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
