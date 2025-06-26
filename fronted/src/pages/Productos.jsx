import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CardProductos from "../components/CardProductos";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [categorias, setCategorias] = useState([]);

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

  const productosFiltrados =
    filtro === "todos"
      ? productos
      : productos.filter((p) => p.categoria === filtro);

  return (
    <section className="w-full mt-12">
      <h1 className="text-3xl font-bold mb-8">Productos</h1>

      <div className="flex flex-col lg:flex-row lg:gap-12 items-start">
        {/* ASIDE - Filtros */}
        <aside className="w-full lg:w-1/4 h-full border border-gray-200 rounded p-4 bg-white shadow-sm self-stretch">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <div className="space-y-2">
            <button
              className={`block w-full text-left px-4 py-2 rounded ${
                filtro === "todos"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setFiltro("todos")}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`block w-full text-left px-4 py-2 rounded ${
                  filtro === cat
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setFiltro(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* PRODUCTOS */}
        <div className="w-full lg:flex-1 min-h-full">
          {productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((p) => (
                <CardProductos key={p.idProducto} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay productos en esta categoría.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Productos;
