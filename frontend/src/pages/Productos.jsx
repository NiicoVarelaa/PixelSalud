import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";
import { RiEmotionSadLine } from "react-icons/ri";
import MiniBanner from "../components/MiniBanner";
import Header from "../components/Header";
import CardProductos from "../components/CardProductos";
import Footer from "../components/Footer";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ordenPrecio, setOrdenPrecio] = useState("defecto");
  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoria = params.get("categoria");

    if (categoria) {
      setFiltro(categoria);
    } else {
      setFiltro("todos");
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/productos");
        setProductos(res.data);
        const categoriasUnicas = [...new Set(res.data.map((p) => p.categoria))];
        setCategorias(categoriasUnicas);
      } catch (err) {
        console.error("Error al traer productos:", err);
      }
    };

    fetchProductos();
  }, []);

  const productosFiltrados = productos
    .filter((p) => {
      if (!p) return false;
      const categoria = p.categoria || "";
      const nombre = p.nombreProducto || "";
      const coincideCategoria = filtro === "todos" || categoria === filtro;
      const coincideNombre = nombre.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideNombre;
    })
    .sort((a, b) => {
      if (ordenPrecio === "menor-precio") return a.precio - b.precio;
      if (ordenPrecio === "mayor-precio") return b.precio - a.precio;
      return 0;
    });

  return (
    <div className="w-full">
      <MiniBanner />
      <Header />
      <section className="w-full mt-8">
        <div className="w-full mb-6 px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <h1 className="text-2xl font-semibold text-gray-800">
              Nuestros Productos
            </h1>

            {/* Contenedor de búsqueda y filtro */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Barra de búsqueda */}
              <div
                className={`relative flex items-center flex-1 ${
                  searchFocused ? "ring-2 ring-primary-600" : ""
                } bg-white rounded-lg border border-gray-200 overflow-hidden min-w-[250px] transition-all duration-200`}
              >
                <div className="pl-3 text-gray-400">
                  <FaSearch size={18} />
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
                    <FaTimes size={16} />
                  </button>
                )}
              </div>

              {/* Filtro de precio personalizado */}
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
                    <FaFilter className="mr-2 text-gray-400" size={14} />
                    {ordenPrecio === "defecto" && "Ordenar por"}
                    {ordenPrecio === "menor-precio" && "Menor precio"}
                    {ordenPrecio === "mayor-precio" && "Mayor precio"}
                  </div>
                  <IoChevronDownOutline
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      dropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown personalizado */}
                {dropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <div
                      className={`px-3 py-2 text-sm cursor-pointer ${
                        ordenPrecio === "defecto"
                          ? "bg-primary-50 text-primary-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() => {
                        setOrdenPrecio("defecto");
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
                        setOrdenPrecio("menor-precio");
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
                        setOrdenPrecio("mayor-precio");
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

          {/* Filtro activo */}
          {filtro !== "todos" && (
            <div className="flex items-center bg-secondary-100 text-gray-800 px-3 py-1 rounded-full text-sm mt-4 w-fit">
              {filtro}
              <button
                onClick={() => setFiltro("todos")}
                className="ml-2 text-secondary-500 transition-colors cursor-pointer"
              >
                <FaTimes size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Contenedor principal */}
        <div className="flex flex-col md:flex-row gap-5 w-full">
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
                  onClick={() => setFiltro("todos")}
                  className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-colors cursor-pointer ${
                    filtro === "todos"
                      ? "bg-primary-50 text-primary-700 font-medium cursor-pointer"
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
                    onClick={() => setFiltro(cat)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-colors ${
                      filtro === cat
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
            {productosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {productosFiltrados.map((p) => (
                  <CardProductos key={p.idProducto} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <RiEmotionSadLine className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <h3 className="text-base font-medium text-gray-700 mb-1">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500 text-sm">
                  Prueba con otros términos de búsqueda
                </p>
                <button
                  onClick={() => {
                    setBusqueda("");
                    setFiltro("todos");
                    setOrdenPrecio("defecto");
                  }}
                  className="mt-3 text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Limpiar filtros
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
