import { useState, useEffect } from "react";
import { useProductStore } from "@store/useProductStore";
import { useAuthStore } from "@store/useAuthStore";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import {
  Search,
  Filter,
  Percent,
  Tag,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Default from "@assets/default.webp";
import { PageHeader } from "@features/admin/components/shared";

const AdminOfertas = () => {
  const { productos, fetchProducts } = useProductStore();
  const token = useAuthStore((state) => state.token);

  // Estados de filtro
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroDescuento, setFiltroDescuento] = useState("todos"); // todos, 10, 15, 20, sin-oferta

  // Estado para productos en campañas (para evitar conflictos)
  const [idsProductosEnCampanas, setIdsProductosEnCampanas] = useState([]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // Fetch de productos en campañas activas
  useEffect(() => {
    const fetchProductosEnCampanas = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await axios.get(`${backendUrl}/campanas/activas`);

        // Extraer todos los IDs de productos de todas las campañas activas
        const ids = new Set();
        for (const campana of response.data) {
          const prodResponse = await axios.get(
            `${backendUrl}/campanas/${campana.idCampana}/productos`,
          );
          prodResponse.data.productos?.forEach((p) => ids.add(p.idProducto));
        }
        setIdsProductosEnCampanas(Array.from(ids));
      } catch (error) {
        console.error("Error al obtener productos en campañas:", error);
      }
    };

    fetchProductosEnCampanas();
  }, []);

  useEffect(() => {
    if (productos.length === 0) {
      fetchProducts();
    }
  }, [productos.length, fetchProducts]);

  // Resetear paginación al filtrar
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroCategoria, filtroDescuento]);

  const getConfig = () => ({
    headers: { Auth: `Bearer ${token}` },
  });

  const getProductoImageUrl = (producto) => {
    if (!producto) return Default;
    if (producto.imagenes && producto.imagenes.length > 0) {
      const imagenPrincipal =
        producto.imagenes.find((img) => img.esPrincipal) ||
        producto.imagenes[0];
      return imagenPrincipal.urlImagen;
    }
    return producto.img || Default;
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(precio);
  };

  // Filtrado de productos
  const productosFiltrados = productos.filter((p) => {
    const cumpleBusqueda =
      !busqueda ||
      p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleCategoria =
      filtroCategoria === "todas" || p.categoria === filtroCategoria;

    let cumpleDescuento = true;
    if (filtroDescuento === "sin-oferta") {
      cumpleDescuento = !p.enOferta || p.porcentajeDescuento === 0;
    } else if (filtroDescuento !== "todos") {
      cumpleDescuento =
        p.enOferta && p.porcentajeDescuento === parseInt(filtroDescuento);
    }

    return cumpleBusqueda && cumpleCategoria && cumpleDescuento;
  });

  // Paginación
  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

  // Obtener categorías únicas
  const categorias = [...new Set(productos.map((p) => p.categoria))].sort();

  // Verificar si producto está en campaña
  const estaEnCampana = (idProducto) => {
    return idsProductosEnCampanas.includes(idProducto);
  };

  // Manejar cambio de oferta
  const handleCambiarOferta = async (producto, activar, porcentaje = null) => {
    // Verificar que no esté en campaña
    if (estaEnCampana(producto.idProducto)) {
      toast.error(
        "Este producto está en una campaña activa. No se pueden aplicar ofertas individuales.",
      );
      return;
    }

    try {
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const datosActualizacion = {
        enOferta: activar,
        porcentajeDescuento: activar ? porcentaje : 0,
      };

      await axios.put(
        `${backendUrl}/productos/actualizar/${producto.idProducto}`,
        datosActualizacion,
        getConfig(),
      );

      toast.success(
        activar
          ? `¡Oferta ${porcentaje}% aplicada a ${producto.nombreProducto}!`
          : `Oferta removida de ${producto.nombreProducto}`,
      );

      fetchProducts();
    } catch (error) {
      console.error("Error al actualizar oferta:", error);
      toast.error(
        error.response?.data?.message || "Error al actualizar la oferta",
      );
    }
  };

  // Modal para establecer descuento
  const handleEstablecerDescuento = async (producto) => {
    const { value: porcentaje } = await Swal.fire({
      title: `Descuento para ${producto.nombreProducto}`,
      html: `
        <div class="flex flex-col gap-4">
          <p class="text-gray-600">Selecciona el porcentaje de descuento:</p>
          <div class="flex justify-center gap-3">
            <button id="btn-10" class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-lg transition-all">
              10% OFF
            </button>
            <button id="btn-15" class="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-lg transition-all">
              15% OFF
            </button>
            <button id="btn-20" class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-lg transition-all">
              20% OFF
            </button>
          </div>
        </div>
      `,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Cancelar",
      didOpen: () => {
        document.getElementById("btn-10").addEventListener("click", () => {
          Swal.clickConfirm();
          Swal.close();
          Swal.getConfirmButton().value = 10;
        });
        document.getElementById("btn-15").addEventListener("click", () => {
          Swal.clickConfirm();
          Swal.close();
          Swal.getConfirmButton().value = 15;
        });
        document.getElementById("btn-20").addEventListener("click", () => {
          Swal.clickConfirm();
          Swal.close();
          Swal.getConfirmButton().value = 20;
        });
      },
      preConfirm: () => {
        return Swal.getConfirmButton().value;
      },
    });

    if (porcentaje) {
      await handleCambiarOferta(producto, true, parseInt(porcentaje));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />

      {/* Header */}
      <div className="mb-8">
        <PageHeader
          title="Gestión de Ofertas Individuales"
          description="Activa o desactiva ofertas en productos individuales (10%, 15%, 20%)"
        />
        <p className="text-sm text-purple-600 mt-2 font-medium">
          ⚠️ No se pueden aplicar ofertas individuales a productos que están en
          campañas activas
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="inline mr-2" size={16} />
              Buscar producto
            </label>
            <input
              type="text"
              placeholder="Nombre del producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline mr-2" size={16} />
              Categoría
            </label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por descuento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Percent className="inline mr-2" size={16} />
              Descuento
            </label>
            <select
              value={filtroDescuento}
              onChange={(e) => setFiltroDescuento(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="todos">Todos</option>
              <option value="sin-oferta">Sin oferta</option>
              <option value="10">10% OFF</option>
              <option value="15">15% OFF</option>
              <option value="20">20% OFF</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Mostrando {productosPaginados.length} de {totalProductos} productos
          </span>
          <span>
            {
              productosFiltrados.filter(
                (p) => p.enOferta && p.porcentajeDescuento > 0,
              ).length
            }{" "}
            productos con oferta activa
          </span>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Regular
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oferta
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productosPaginados.map((producto) => {
              const tieneOferta =
                producto.enOferta && producto.porcentajeDescuento > 0;
              const precioConDescuento = tieneOferta
                ? producto.precioRegular *
                  (1 - producto.porcentajeDescuento / 100)
                : producto.precioRegular;
              const enCampana = estaEnCampana(producto.idProducto);

              return (
                <tr key={producto.idProducto} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getProductoImageUrl(producto)}
                        alt={producto.nombreProducto}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {producto.nombreProducto}
                        </p>
                        <p className="text-sm text-gray-500">
                          Stock: {producto.stock}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {producto.categoria}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      {tieneOferta && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatearPrecio(producto.precioRegular)}
                        </span>
                      )}
                      <span
                        className={`font-bold ${tieneOferta ? "text-red-600" : "text-gray-900"}`}
                      >
                        {formatearPrecio(precioConDescuento)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {enCampana && (
                        <span className="inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                          En Campaña
                        </span>
                      )}
                      {tieneOferta ? (
                        <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                          <Percent size={14} className="mr-1" />
                          {producto.porcentajeDescuento}% OFF
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                          Sin oferta
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {enCampana ? (
                        <span className="text-xs text-purple-600 font-medium">
                          Producto en campaña
                        </span>
                      ) : tieneOferta ? (
                        <>
                          <button
                            onClick={() => handleEstablecerDescuento(producto)}
                            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Cambiar %
                          </button>
                          <button
                            onClick={() => handleCambiarOferta(producto, false)}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <XCircle size={16} />
                            Quitar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEstablecerDescuento(producto)}
                          className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <CheckCircle size={16} />
                          Activar Oferta
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {productosPaginados.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Tag size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No se encontraron productos</p>
            <p className="text-sm">Intenta ajustar los filtros</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setPaginaActual(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            Anterior
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
              (pagina) => (
                <button
                  key={pagina}
                  onClick={() => setPaginaActual(pagina)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    pagina === paginaActual
                      ? "bg-green-600 text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pagina}
                </button>
              ),
            )}
          </div>

          <button
            onClick={() => setPaginaActual(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOfertas;
