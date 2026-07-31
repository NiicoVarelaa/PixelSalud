import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Search, Plus } from "lucide-react";
import CustomSelect from "./CustomSelect";

const ProductFilters = ({
  busqueda,
  onBusquedaChange,
  filtroCategoria,
  onCategoriaChange,
  filtroEstado,
  onEstadoChange,
  categorias,
  onAddProduct,
}) => {
  const categoriasPermitidas = useMemo(() => {
    return categorias.filter((cat) => {
      const catLower = cat.toLowerCase();
      return (
        !catLower.includes("cyber") &&
        !catLower.includes("black friday") &&
        !catLower.includes("oferta") &&
        !catLower.includes("descuento") &&
        !catLower.includes("promo")
      );
    });
  }, [categorias]);

  const opcionesCategoria = useMemo(() => {
    return [
      { value: "todas", label: "Todas las categorías" },
      ...categoriasPermitidas.map((cat) => ({ value: cat, label: cat })),
    ];
  }, [categoriasPermitidas]);

  const opcionesEstado = useMemo(() => {
    return [
      { value: "todos", label: "Todos los estados" },
      { value: "activos", label: "Activos" },
      { value: "inactivos", label: "Inactivos" },
    ];
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2">
          <div className="flex-1 min-w-0 relative group">
            <label htmlFor="search" className="sr-only">
              Buscar productos
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
            </div>
            <input
              type="search"
              id="search"
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              className={`
                w-full pl-11 pr-4 py-2.5 bg-gray-50 
                border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-primary-600
              `}
              placeholder="Buscar por nombre del producto"
              aria-label="Buscar productos por nombre"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={onAddProduct}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-green-600/20 focus-visible:ring-4 focus-visible:ring-green-500/30 outline-none cursor-pointer"
              title="Agregar Producto"
              aria-label="Agregar Producto"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-green-600 group-hover:bg-green-50">
                <Plus size={16} />
              </span>
              <span className="text-sm font-medium hidden sm:inline">Agregar producto</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomSelect
            id="filter-category"
            label="Categoría"
            value={filtroCategoria}
            onChange={onCategoriaChange}
            options={opcionesCategoria}
          />

          <CustomSelect
            id="filter-status"
            label="Estado"
            value={filtroEstado}
            onChange={onEstadoChange}
            options={opcionesEstado}
          />
        </div>
      </div>
    </div>
  );
};

ProductFilters.propTypes = {
  busqueda: PropTypes.string.isRequired,
  onBusquedaChange: PropTypes.func.isRequired,
  filtroCategoria: PropTypes.string.isRequired,
  onCategoriaChange: PropTypes.func.isRequired,
  filtroEstado: PropTypes.string.isRequired,
  onEstadoChange: PropTypes.func.isRequired,
  categorias: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddProduct: PropTypes.func.isRequired,
};

export default ProductFilters;
