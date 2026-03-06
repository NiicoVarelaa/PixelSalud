import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Search, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4">
      <div className="flex flex-col gap-2.5">
        {/* Fila Superior: Búsqueda y Botones */}
        <div className="flex gap-2">
          {/* Búsqueda */}
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
                border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400
                transition-all duration-200 ease-in-out outline-none
                hover:border-gray-300
                focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10
              `}
              placeholder="Buscar por nombre, marca o código..."
              aria-label="Buscar productos por nombre"
            />
          </div>

          {/* Botones de Acción (Reordenados) */}
          <div className="flex gap-2 shrink-0">
            {/* 1. Botón Agregar Producto (Principal) */}
            <button
              onClick={onAddProduct}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-green-600/20 focus-visible:ring-4 focus-visible:ring-green-500/30 outline-none cursor-pointer"
              title="Agregar Producto"
              aria-label="Agregar Producto"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline font-medium text-sm">
                Agregar Producto
              </span>
            </button>

            {/* 2. Botón Volver (Secundario) */}
            <Link
              to="/admin"
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2.5 rounded-xl transition-all shadow-sm border border-gray-200 focus-visible:ring-4 focus-visible:ring-gray-200 outline-none"
              title="Volver al panel"
              aria-label="Volver al panel"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline font-medium text-sm">
                Volver
              </span>
            </Link>
          </div>
        </div>

        {/* Fila Inferior: Filtros Custom */}
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
