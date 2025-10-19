import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, X, Filter, ChevronDown, Frown } from "lucide-react";

import { useProductStore } from "../store/useProductStore";
import { useFiltroStore } from "../store/useFiltroStore";

import Header from "../components/Header";
import Breadcrumbs from "../components/Breadcrumbs";
import CardSkeleton from "../components/CardSkeleton";
import CardProductos from "../components/CardProductos";
import Footer from "../components/Footer";

const Productos = () => {

  const { categorias, isLoading, fetchProducts, productos } = useProductStore();
  const {
    filtroCategoria,
    busqueda,
    ordenPrecio,
    setFiltroCategoria,
    setBusqueda,
    setOrdenPrecio,
    limpiarFiltros,
    getProductosFiltrados,
  } = useFiltroStore();

  const productosFiltrados = getProductosFiltrados();

  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (productos.length === 0) {
      fetchProducts();
    }
  }, [productos.length, fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoriaURL = params.get("categoria");
    if (categoriaURL) {
      setFiltroCategoria(categoriaURL);
    }
  }, [location.search, setFiltroCategoria]);


  return (
    <div>
      <Header />
      <section className="w-full my-16 md:my-20 ">        
        <Breadcrumbs categoria={filtroCategoria} />        
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
                onChange={(e) => setBusqueda(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="px-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filtro de precio */}
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
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <div
                    className={`px-3 py-2 text-sm cursor-pointer ${
                      ordenPrecio === "defecto" ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => { setOrdenPrecio("defecto"); setDropdownOpen(false); }}
                  >
                    Ordenar por
                  </div>
                  <div
                    className={`px-3 py-2 text-sm cursor-pointer ${
                      ordenPrecio === "menor-precio" ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => { setOrdenPrecio("menor-precio"); setDropdownOpen(false); }}
                  >
                    Precio: Menor a mayor
                  </div>
                  <div
                    className={`px-3 py-2 text-sm cursor-pointer ${
                      ordenPrecio === "mayor-precio" ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => { setOrdenPrecio("mayor-precio"); setDropdownOpen(false); }}
                  >
                    Precio: Mayor a menor
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {filtroCategoria !== "todos" && (
          <div className="flex items-center bg-secondary-100 text-gray-800 px-3 py-1 rounded-full text-sm mt-4 w-fit">
            {filtroCategoria}
            <button
              onClick={() => setFiltroCategoria("todos")}
              className="ml-2 text-secondary-500 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 w-full my-8">
          {/* Filtros laterales */}
          <aside className="w-full md:w-56 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-200">
                <h2 className="font-medium text-gray-800 text-sm uppercase">
                  Categorías
                </h2>
              </div>
              <div className="p-1">
                <button
                  onClick={() => setFiltroCategoria("todos")}
                  className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-colors cursor-pointer ${
                    filtroCategoria === "todos"
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-2">Todos</span>
                  <span className="ml-auto bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded">
                    {productos.length}
                  </span>
                </button>

                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFiltroCategoria(cat)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-colors ${
                      filtroCategoria === cat
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Lista de productos */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            ) : productosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {productosFiltrados.map((p) => (
                  <CardProductos key={p.idProducto} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center w-full">
                <Frown className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500 text-sm">
                  Prueba cambiando los filtros o el término de búsqueda.
                </p>
                <button
                  onClick={limpiarFiltros}
                  className="mt-4 text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Productos;