import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Filter,
  ChevronDown,
  Frown,
  ChevronLeft,
  ChevronRight,
  Percent,
} from "lucide-react";

import { useProductStore } from "@store/useProductStore";
import { useFiltroStore } from "@store/useFiltroStore";

import { Header, Footer } from "@components/organisms";
import { Breadcrumbs } from "@components/molecules/navigation";
import { CardSkeleton } from "@components/molecules/cards";
import { CardProductos } from "@features/customer/components/products";

const Ofertas = () => {
  const { categorias, isLoading, fetchProducts, productos } = useProductStore();
  const {
    busqueda,
    ordenPrecio,
    setBusqueda,
    setOrdenPrecio,
    getProductosFiltrados,
  } = useFiltroStore();

  // Estados locales
  const [paginaActual, setPaginaActual] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [filtroDescuento, setFiltroDescuento] = useState("todos"); // todos, 10, 15, 20

  const productosPorPagina = 12;
  const navigate = useNavigate();

  useEffect(() => {
    if (productos.length === 0) {
      fetchProducts();
    }
  }, [productos.length, fetchProducts]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, ordenPrecio, filtroDescuento]);

  // Filtrar productos con ofertas individuales (enOferta=true)
  const productosConOferta = productos.filter((p) => p.enOferta === true);

  // Aplicar filtros adicionales
  let productosParaMostrar = productosConOferta;

  // Filtro por búsqueda
  if (busqueda) {
    productosParaMostrar = productosParaMostrar.filter((p) =>
      p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase()),
    );
  }

  // Filtro por porcentaje de descuento
  if (filtroDescuento !== "todos") {
    const descuento = parseInt(filtroDescuento);
    productosParaMostrar = productosParaMostrar.filter(
      (p) => p.porcentajeDescuento === descuento,
    );
  }

  // Aplicar ordenamiento
  if (ordenPrecio === "menor") {
    productosParaMostrar = [...productosParaMostrar].sort(
      (a, b) =>
        (a.precioFinal || a.precioRegular) - (b.precioFinal || b.precioRegular),
    );
  } else if (ordenPrecio === "mayor") {
    productosParaMostrar = [...productosParaMostrar].sort(
      (a, b) =>
        (b.precioFinal || b.precioRegular) - (a.precioFinal || a.precioRegular),
    );
  }

  // Cálculos de paginación
  const totalProductos = productosParaMostrar.length;
  const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosPaginados = productosParaMostrar.slice(
    indiceInicio,
    indiceFin,
  );

  // Funciones de navegación
  const irAPaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const irAPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const irAPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generar números de página para mostrar
  const generarNumerosPagina = () => {
    const numeros = [];
    const maxBotones = 5;

    if (totalPaginas <= maxBotones) {
      for (let i = 1; i <= totalPaginas; i++) {
        numeros.push(i);
      }
    } else {
      if (paginaActual <= 3) {
        for (let i = 1; i <= 4; i++) {
          numeros.push(i);
        }
        numeros.push("...");
        numeros.push(totalPaginas);
      } else if (paginaActual >= totalPaginas - 2) {
        numeros.push(1);
        numeros.push("...");
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) {
          numeros.push(i);
        }
      } else {
        numeros.push(1);
        numeros.push("...");
        numeros.push(paginaActual - 1);
        numeros.push(paginaActual);
        numeros.push(paginaActual + 1);
        numeros.push("...");
        numeros.push(totalPaginas);
      }
    }

    return numeros;
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setBusqueda(localSearch);
    }
  };

  const limpiarBusqueda = () => {
    setLocalSearch("");
    setBusqueda("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs categoria="Ofertas" />

        {/* Header de Ofertas */}
        <div className="mb-8 bg-linear-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <Percent className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">¡Ofertas Especiales!</h1>
              <p className="text-white/90 text-lg">
                Descuentos de hasta 20% en productos seleccionados
              </p>
            </div>
          </div>
          <div className="flex gap-4 text-sm flex-wrap">
            <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <span className="font-semibold">{productosConOferta.length}</span>{" "}
              productos en oferta
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              Descuentos de{" "}
              <span className="font-semibold">10%, 15% y 20%</span>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div
              className={`flex items-center bg-white border-2 rounded-xl px-4 py-3 transition-all duration-200 ${
                searchFocused
                  ? "border-primary-500 shadow-lg shadow-primary-500/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Search
                className={`transition-colors ${
                  searchFocused ? "text-primary-600" : "text-gray-400"
                }`}
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar en ofertas..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 ml-3 outline-none text-gray-700 placeholder-gray-400"
              />
              {localSearch && (
                <button
                  onClick={limpiarBusqueda}
                  className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Filtro por descuento */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 transition-all cursor-pointer min-w-[200px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Percent size={18} className="text-gray-600" />
                <span className="text-gray-700 font-medium">
                  {filtroDescuento === "todos"
                    ? "Todos los descuentos"
                    : `${filtroDescuento}% OFF`}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setFiltroDescuento("todos");
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                    filtroDescuento === "todos"
                      ? "bg-primary-50 text-primary-700"
                      : ""
                  }`}
                >
                  Todos los descuentos
                </button>
                <button
                  onClick={() => {
                    setFiltroDescuento("10");
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                    filtroDescuento === "10"
                      ? "bg-primary-50 text-primary-700"
                      : ""
                  }`}
                >
                  10% OFF
                </button>
                <button
                  onClick={() => {
                    setFiltroDescuento("15");
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                    filtroDescuento === "15"
                      ? "bg-primary-50 text-primary-700"
                      : ""
                  }`}
                >
                  15% OFF
                </button>
                <button
                  onClick={() => {
                    setFiltroDescuento("20");
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                    filtroDescuento === "20"
                      ? "bg-primary-50 text-primary-700"
                      : ""
                  }`}
                >
                  20% OFF
                </button>
              </div>
            )}
          </div>

          {/* Ordenar */}
          <select
            value={ordenPrecio}
            onChange={(e) => setOrdenPrecio(e.target.value)}
            className="bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 outline-none transition-all cursor-pointer"
          >
            <option value="defecto">Orden por defecto</option>
            <option value="menor">Precio: Menor a Mayor</option>
            <option value="mayor">Precio: Mayor a Menor</option>
          </select>
        </div>

        {/* Resultados */}
        <div className="mb-4 text-gray-600">
          Mostrando {productosPaginados.length} de {totalProductos} ofertas
        </div>

        {/* Grid de productos */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : productosParaMostrar.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Frown className="w-20 h-20 text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No se encontraron ofertas
            </h3>
            <p className="text-gray-500 mb-6">
              Intentá modificar los filtros o volvé más tarde
            </p>
            <button
              onClick={() => {
                setBusqueda("");
                setFiltroDescuento("todos");
                setLocalSearch("");
              }}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosPaginados.map((producto) => (
                <CardProductos key={producto.idProducto} producto={producto} />
              ))}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={irAPaginaAnterior}
                  disabled={paginaActual === 1}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    paginaActual === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                {generarNumerosPagina().map((numero, index) => {
                  if (numero === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={numero}
                      onClick={() => irAPagina(numero)}
                      className={`min-w-10 h-10 rounded-lg font-medium transition-all cursor-pointer ${
                        paginaActual === numero
                          ? "bg-primary-600 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200"
                      }`}
                    >
                      {numero}
                    </button>
                  );
                })}

                <button
                  onClick={irAPaginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    paginaActual === totalPaginas
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Ofertas;
