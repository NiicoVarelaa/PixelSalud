import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Filter,
  ChevronDown,
  Frown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useProductStore } from "../store/useProductStore";
import { useFiltroStore } from "../store/useFiltroStore";

import Header from "../components/Header";
import Breadcrumbs from "../components/Breadcrumbs";
import CardSkeleton from "../components/CardSkeleton";
import CardProductos from "../components/CardProductos";
import ModalRecetas from "../components/ModalRecetas";
import Footer from "../components/Footer";
import BuscarRecetaButton from "../components/BuscarRecetaButton";

import { useAuthStore } from "../store/useAuthStore";
import { useCarritoStore } from "../store/useCarritoStore";

const Productos = () => {
  const { categorias, isLoading, fetchProducts, productos } = useProductStore();
  const {
    filtroCategoria,
    busqueda,
    ordenPrecio,
    setFiltroCategoria,
    setBusqueda,
    setOrdenPrecio,
    getProductosFiltrados,
  } = useFiltroStore();

  const productosFiltrados = getProductosFiltrados();
  const { user } = useAuthStore();
  const [recetasActivas, setRecetasActivas] = useState([]);
  const [recetaBuscada, setRecetaBuscada] = useState(false);
  const [showModalRecetas, setShowModalRecetas] = useState(false);
  const { agregarCarrito } = useCarritoStore();

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 10;

  // Handler para agregar todos los productos de la receta al carrito
  const handleAddAllRecetaToCart = async () => {
    if (recetasActivas && recetasActivas.length > 0) {
      for (const receta of recetasActivas) {
        await agregarCarrito({
          idProducto: receta.idProducto,
          cantidad: receta.cantidad,
        });
      }
      setShowModalRecetas(false);
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (productos.length === 0) {
      fetchProducts();
    }
  }, [productos.length, fetchProducts]);

  // --- Sincronización de filtros con la query string ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoriaURL = params.get("categoria") ?? "todos";
    const busquedaURL = params.get("busqueda") ?? "";
    const ordenURL = params.get("orden") ?? "defecto";

    setFiltroCategoria(categoriaURL);
    setBusqueda(busquedaURL);
    setOrdenPrecio(ordenURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [filtroCategoria, busqueda, ordenPrecio]);

  const updateQueryParam = (key, value) => {
    const params = new URLSearchParams(location.search);

    if (!value || value === "todos" || value === "defecto") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const search = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: search ? `?${search}` : "",
      },
      { replace: true },
    );
  };

  const setCategoriaYSync = (cat) => {
    setFiltroCategoria(cat);
    updateQueryParam("categoria", cat);
  };

  const setBusquedaYSync = (value) => {
    setBusqueda(value);
    updateQueryParam("busqueda", value);
  };

  const setOrdenYSync = (value) => {
    setOrdenPrecio(value);
    updateQueryParam("orden", value);
  };

  // Filtrado especial para medicamentos con receta
  let productosParaMostrar = productosFiltrados;
  // Log para debug: mostrar productos ordenados cada vez que cambia el filtro de ordenPrecio

  const esCategoriaReceta = filtroCategoria === "Medicamentos con Receta";

  if (esCategoriaReceta) {
    if (!user) {
      productosParaMostrar = [];
    } else if (!recetaBuscada) {
      productosParaMostrar = [];
    } else if (recetasActivas.length > 0) {
      // Mostrar solo el producto de la receta activa
      const productosRecetaIds = recetasActivas.map((r) => r.idProducto);
      productosParaMostrar = productosFiltrados.filter((p) =>
        productosRecetaIds.includes(p.idProducto),
      );
    } else {
      productosParaMostrar = [];
    }
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
    const maxBotones = 5; // Máximo de botones de página a mostrar

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

  return (
    <div>
      <Header />
      <section className="w-full my-12">
        <Breadcrumbs categoria={filtroCategoria} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full mb-6">
          <h2 className="text-2xl md:text-3xl font-medium text-left text-gray-800">
            Nuestros Productos
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Buscador */}
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
                onChange={(e) => setBusquedaYSync(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {busqueda && (
                <button
                  onClick={() => setBusquedaYSync("")}
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
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <div
                    className={`px-3 py-2 text-sm cursor-pointer ${
                      ordenPrecio === "defecto"
                        ? "bg-primary-50 text-primary-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => {
                      setOrdenYSync("defecto");
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
                      setOrdenYSync("menor-precio");
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
                      setOrdenYSync("mayor-precio");
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

        <div className="flex flex-col md:flex-row gap-8 w-full my-8">
          {/* Filtros laterales */}
          <aside className="w-full md:w-56 shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-200">
                <h2 className="font-medium text-gray-800 text-sm uppercase">
                  Categorías
                </h2>
              </div>
              <div className="p-1">
                <button
                  onClick={() => setCategoriaYSync("todos")}
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
                    onClick={() => setCategoriaYSync(cat)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-colors ${
                      filtroCategoria === cat
                        ? "bg-primary-50 text-primary-700 font-medium cursor-pointer"
                        : "text-gray-600 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            ) : productosParaMostrar.length > 0 ? (
              <>
                {showModalRecetas ? null : recetaBuscada &&
                  recetasActivas.length > 0 &&
                  user &&
                  esCategoriaReceta ? (
                  <div className="flex justify-center my-8">
                    <button
                      onClick={() => setShowModalRecetas(true)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold shadow hover:bg-primary-700 transition cursor-pointer"
                    >
                      Ver Receta
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                      {productosPaginados.map((p) => (
                        <CardProductos key={p.idProducto} product={p} />
                      ))}
                    </div>

                    {/* Controles de paginación */}
                    {totalPaginas > 1 && (
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg border border-gray-200 p-4">
                        <div className="text-sm text-gray-600">
                          Mostrando {indiceInicio + 1} -{" "}
                          {Math.min(indiceFin, totalProductos)} de{" "}
                          {totalProductos} productos
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={irAPaginaAnterior}
                            disabled={paginaActual === 1}
                            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                              paginaActual === 1
                                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                          >
                            <ChevronLeft size={18} />
                          </button>

                          <div className="flex gap-1">
                            {generarNumerosPagina().map((numero, index) =>
                              numero === "..." ? (
                                <span
                                  key={`ellipsis-${index}`}
                                  className="px-3 py-2 text-gray-400"
                                >
                                  ...
                                </span>
                              ) : (
                                <button
                                  key={numero}
                                  onClick={() => irAPagina(numero)}
                                  className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                    paginaActual === numero
                                      ? "bg-primary-600 text-white"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {numero}
                                </button>
                              ),
                            )}
                          </div>

                          <button
                            onClick={irAPaginaSiguiente}
                            disabled={paginaActual === totalPaginas}
                            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                              paginaActual === totalPaginas
                                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center w-full">
                <Frown className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  {esCategoriaReceta
                    ? user
                      ? recetaBuscada
                        ? "No tienes recetas activas"
                        : "Debes buscar tu receta"
                      : "Debes iniciar sesión para ver medicamentos con receta"
                    : "No se encontraron productos"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {esCategoriaReceta
                    ? "Solo puedes comprar medicamentos con receta si tienes una receta activa."
                    : "Prueba cambiando los filtros o el término de búsqueda."}
                </p>
                {!user && esCategoriaReceta && (
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="mt-4 text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Iniciar sesión
                  </button>
                )}
                {!recetaBuscada && user && esCategoriaReceta && (
                  <BuscarRecetaButton
                    onRecetaEncontrada={(recetas) => {
                      setRecetasActivas(recetas);
                      setRecetaBuscada(true);
                      setShowModalRecetas(true);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />

      {/* Modal para mostrar recetas activas y agregar todos al carrito */}
      <ModalRecetas
        isOpen={showModalRecetas}
        onClose={() => setShowModalRecetas(false)}
        recetas={recetasActivas}
        onAddAllToCart={handleAddAllRecetaToCart}
      />
    </div>
  );
};

export default Productos;
