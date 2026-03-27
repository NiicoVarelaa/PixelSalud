import { useState } from "react";
import { Search, X, Filter, ChevronDown } from "lucide-react";

export const ProductTopBar = ({ busqueda, ordenPrecio, updateParams }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full mb-6">
      <h2 className="text-2xl md:text-3xl font-medium text-left text-gray-800">
        Nuestros Productos
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div
          className={`relative flex items-center flex-1 ${
            searchFocused ? "ring-2 ring-primary-600" : ""
          } bg-white rounded-lg border border-gray-200 overflow-hidden min-w-[250px] transition-all duration-200`}
        >
          <div className="pl-3 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full py-2 px-3 outline-none text-gray-700 placeholder-gray-400 text-sm"
            value={busqueda}
            onChange={(e) => updateParams("busqueda", e.target.value, true)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {busqueda && (
            <button
              onClick={() => updateParams("busqueda", "", true)}
              className="px-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-[200px]">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center justify-between w-full py-2 px-3 text-sm text-gray-700 cursor-pointer bg-white border ${
              dropdownOpen
                ? "border-primary-600 ring-1 ring-primary-600"
                : "border-gray-200 hover:border-gray-300"
            } rounded-lg transition-all duration-200`}
          >
            <div className="flex items-center">
              <Filter className="mr-2 text-gray-400" size={14} />
              {ordenPrecio === "defecto" && "Ordenar por"}
              {ordenPrecio === "menor-precio" && "Menor precio"}
              {ordenPrecio === "mayor-precio" && "Mayor precio"}
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <div
                className={`px-3 py-2 text-sm cursor-pointer ${
                  ordenPrecio === "defecto"
                    ? "bg-primary-50 text-primary-700"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => {
                  updateParams("orden", "defecto", true);
                  setDropdownOpen(false);
                }}
              >
                Ordenar por
              </div>
              <div
                className={`px-3 py-2 text-sm cursor-pointer ${
                  ordenPrecio === "menor-precio"
                    ? "bg-primary-50 text-primary-700"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => {
                  updateParams("orden", "menor-precio", true);
                  setDropdownOpen(false);
                }}
              >
                Precio: Menor a mayor
              </div>
              <div
                className={`px-3 py-2 text-sm cursor-pointer ${
                  ordenPrecio === "mayor-precio"
                    ? "bg-primary-50 text-primary-700"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => {
                  updateParams("orden", "mayor-precio", true);
                  setDropdownOpen(false);
                }}
              >
                Precio: Mayor a menor
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};