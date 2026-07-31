import { Search } from "lucide-react";

const ProductSearchBar = ({ value, onChange }) => (
  <div className="mb-3 shrink-0">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Buscar por nombre, categoría o estado..."
        className="w-full h-[42px] pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
      />
    </div>
  </div>
);

export default ProductSearchBar;
