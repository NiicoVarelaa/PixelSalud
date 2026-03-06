import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useAuthStore } from "@store/useAuthStore";
import { useProductStore } from "@store/useProductStore";
import Default from "@assets/default.webp";
import { Link } from "react-router-dom";
import {
  Tag,
  Plus,
  Search,
  Filter,
  X,
  Edit2,
  Power,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Percent,
  Package,
  CheckSquare,
  Square,
  Sparkles,
  Grid3x3,
  List,
  Trash2,
  ArrowLeft,
  Users,
} from "lucide-react";
import { PageHeader } from "@features/admin/components/shared";

const AdminCampanas = () => {
  // Estados para campañas
  const [campanas, setCampanas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [campanaEditando, setCampanaEditando] = useState(null);

  // Estados para la campaña actual
  const [nuevaCampana, setNuevaCampana] = useState({
    nombreCampana: "",
    descripcion: "",
    porcentajeDescuento: "",
    fechaInicio: "",
    fechaFin: "",
    tipo: "DESCUENTO",
  });

  // Estados para productos
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  // Estados de vista
  const [vistaMode, setVistaMode] = useState("cards");
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const modalRef = useRef();
  const { productos, fetchProducts, categorias } = useProductStore();
  const token = useAuthStore((state) => state.token);

  // ============= UTILITY FUNCTIONS =============
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

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    return new Date(fecha).toLocaleDateString("es-AR");
  };

  // ============= API CALLS =============
  const fetchCampanas = async () => {
    setCargando(true);
    try {
      await fetchProducts();
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.get(`${backendUrl}/campanas`, getConfig());
      setCampanas(response.data);
    } catch (error) {
      console.error("Error al cargar campañas:", error);
      toast.error("Error al cargar las campañas.");
    } finally {
      setCargando(false);
    }
  };

  const crearCampana = async () => {
    try {
      if (!nuevaCampana.nombreCampana || !nuevaCampana.porcentajeDescuento) {
        toast.error("Complete los campos obligatorios");
        return;
      }

      if (productosSeleccionados.length === 0) {
        toast.error("Seleccione al menos un producto");
        return;
      }

      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      // 1. Crear la campaña
      const responseCampana = await axios.post(
        `${backendUrl}/campanas`,
        {
          nombreCampana: nuevaCampana.nombreCampana,
          descripcion: nuevaCampana.descripcion,
          porcentajeDescuento: parseFloat(nuevaCampana.porcentajeDescuento),
          fechaInicio: nuevaCampana.fechaInicio,
          fechaFin: nuevaCampana.fechaFin,
          tipo: nuevaCampana.tipo,
          esActiva: true,
        },
        getConfig(),
      );

      const idCampana = responseCampana.data.idCampana;

      // 2. Agregar productos a la campaña
      await axios.post(
        `${backendUrl}/campanas/${idCampana}/productos`,
        {
          productosIds: productosSeleccionados,
        },
        getConfig(),
      );

      toast.success(
        `¡Campaña "${nuevaCampana.nombreCampana}" creada con ${productosSeleccionados.length} productos!`,
      );

      setModalAbierto(false);
      limpiarFormulario();
      fetchCampanas();
    } catch (error) {
      console.error("Error al crear campaña:", error);
      toast.error(error.response?.data?.message || "Error al crear la campaña");
    }
  };

  const editarCampana = async (campana) => {
    try {
      // Cargar productos de la campaña
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.get(
        `${backendUrl}/campanas/${campana.idCampana}/productos`,
        getConfig(),
      );

      setCampanaEditando(campana);
      setModoEdicion(true);
      setNuevaCampana({
        nombreCampana: campana.nombreCampana,
        descripcion: campana.descripcion || "",
        porcentajeDescuento: campana.porcentajeDescuento,
        fechaInicio: campana.fechaInicio?.split(" ")[0] || "",
        fechaFin: campana.fechaFin?.split(" ")[0] || "",
        tipo: campana.tipo,
      });

      // El backend devuelve { productos: [...] } no un array directo
      const productosIds = response.data.productos
        ? response.data.productos.map((p) => p.idProducto)
        : [];
      setProductosSeleccionados(productosIds);
      setModalAbierto(true);
    } catch (error) {
      console.error("Error al cargar campaña:", error);
      toast.error("Error al cargar los datos de la campaña");
    }
  };

  const actualizarCampana = async () => {
    try {
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      // 1. Actualizar datos de la campaña
      await axios.put(
        `${backendUrl}/campanas/${campanaEditando.idCampana}`,
        {
          nombreCampana: nuevaCampana.nombreCampana,
          descripcion: nuevaCampana.descripcion,
          porcentajeDescuento: parseFloat(nuevaCampana.porcentajeDescuento),
          fechaInicio: nuevaCampana.fechaInicio,
          fechaFin: nuevaCampana.fechaFin,
          tipo: nuevaCampana.tipo,
        },
        getConfig(),
      );

      // 2. Obtener productos actuales de la campaña
      const responseProductos = await axios.get(
        `${backendUrl}/campanas/${campanaEditando.idCampana}/productos`,
        getConfig(),
      );
      const productosActuales = responseProductos.data.productos
        ? responseProductos.data.productos.map((p) => p.idProducto)
        : [];

      // 3. Calcular cambios
      const productosParaAgregar = productosSeleccionados.filter(
        (id) => !productosActuales.includes(id),
      );
      const productosParaEliminar = productosActuales.filter(
        (id) => !productosSeleccionados.includes(id),
      );

      // 4. Agregar nuevos productos
      if (productosParaAgregar.length > 0) {
        await axios.post(
          `${backendUrl}/campanas/${campanaEditando.idCampana}/productos`,
          { productosIds: productosParaAgregar },
          getConfig(),
        );
      }

      // 5. Eliminar productos removidos
      if (productosParaEliminar.length > 0) {
        await axios.delete(
          `${backendUrl}/campanas/${campanaEditando.idCampana}/productos`,
          {
            ...getConfig(),
            data: { productosIds: productosParaEliminar },
          },
        );
      }

      toast.success("¡Campaña actualizada correctamente!");
      setModalAbierto(false);
      limpiarFormulario();
      fetchCampanas();
    } catch (error) {
      console.error("Error al actualizar campaña:", error);
      toast.error("Error al actualizar la campaña");
    }
  };

  const toggleActiva = async (idCampana, esActiva) => {
    const accion = esActiva ? "Desactivar" : "Activar";
    const participio = esActiva ? "Desactivada" : "Activada";

    const result = await Swal.fire({
      title: `¿${accion} campaña?`,
      text: `La campaña ${esActiva ? "dejará de aplicarse" : "se aplicará"} a los productos.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: esActiva ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Sí, ${accion.toLowerCase()}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000";
        await axios.put(
          `${backendUrl}/campanas/${idCampana}`,
          { esActiva: !esActiva },
          getConfig(),
        );

        Swal.fire({
          icon: "success",
          title: `¡${participio}!`,
          text: `La campaña ha sido ${participio.toLowerCase()} correctamente.`,
          confirmButtonColor: "#9333ea",
        });
        fetchCampanas();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cambiar el estado",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const eliminarCampana = async (idCampana, nombreCampana) => {
    const result = await Swal.fire({
      title: "¿Eliminar campaña?",
      text: `Se eliminará "${nombreCampana}" y todos sus productos asociados.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000";
        await axios.delete(`${backendUrl}/campanas/${idCampana}`, getConfig());

        Swal.fire({
          icon: "success",
          title: "¡Eliminada!",
          text: "La campaña ha sido eliminada correctamente.",
          confirmButtonColor: "#9333ea",
        });
        fetchCampanas();
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la campaña",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  // ============= HANDLERS =============
  const limpiarFormulario = () => {
    setNuevaCampana({
      nombreCampana: "",
      descripcion: "",
      porcentajeDescuento: "",
      fechaInicio: "",
      fechaFin: "",
      tipo: "DESCUENTO",
    });
    setProductosSeleccionados([]);
    setModoEdicion(false);
    setCampanaEditando(null);
    setBusquedaProducto("");
    setCategoriaFiltro("");
  };

  const handleAbrirModal = () => {
    limpiarFormulario();
    setModalAbierto(true);
  };

  const toggleProductoSeleccion = (idProducto) => {
    setProductosSeleccionados((prev) =>
      prev.includes(idProducto)
        ? prev.filter((id) => id !== idProducto)
        : [...prev, idProducto],
    );
  };

  const seleccionarTodos = () => {
    const productosVisibles = productosDisponibles.map((p) => p.idProducto);
    if (productosSeleccionados.length === productosVisibles.length) {
      setProductosSeleccionados([]);
    } else {
      setProductosSeleccionados(productosVisibles);
    }
  };

  // ============= COMPUTED VALUES =============
  const productosDisponibles = useMemo(() => {
    return productos.filter((p) => {
      const matchBusqueda = p.nombreProducto
        .toLowerCase()
        .includes(busquedaProducto.toLowerCase());
      const matchCategoria =
        !categoriaFiltro || p.categoria === categoriaFiltro;
      return matchBusqueda && matchCategoria;
    });
  }, [productos, busquedaProducto, categoriaFiltro]);

  const campanasFiltradas = useMemo(() => {
    return campanas.filter((campana) => {
      const matchBusqueda = campana.nombreCampana
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const matchEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activas" && campana.esActiva) ||
        (filtroEstado === "inactivas" && !campana.esActiva);
      return matchBusqueda && matchEstado;
    });
  }, [campanas, busqueda, filtroEstado]);

  const ITEMS_PER_PAGE = vistaMode === "cards" ? 9 : 8;
  const totalPaginas = Math.ceil(campanasFiltradas.length / ITEMS_PER_PAGE);
  const indiceInicio = (paginaActual - 1) * ITEMS_PER_PAGE;
  const indiceFin = indiceInicio + ITEMS_PER_PAGE;
  const campanasActuales = campanasFiltradas.slice(indiceInicio, indiceFin);

  // ============= EFFECTS =============
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        await fetchProducts();
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await axios.get(`${backendUrl}/campanas`, getConfig());
        setCampanas(response.data);
      } catch (error) {
        console.error("Error al cargar campañas:", error);
        toast.error("Error al cargar las campañas.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado, vistaMode]);

  // ============= RENDER =============
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 md:p-6 w-full">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Tag className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                    Gestión de Campañas
                  </h1>
                  <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
                    Administra campañas de ofertas con múltiples productos
                  </p>
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={handleAbrirModal}
                  className="flex items-center gap-2 bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl transition-all shadow-lg font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Nueva Campaña
                </button>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Volver
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Total Campañas
                  </p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">
                    {campanas.length}
                  </p>
                </div>
                <Tag className="w-12 h-12 text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Activas</p>
                  <p className="text-3xl font-bold text-green-700 mt-1">
                    {campanas.filter((c) => c.esActiva).length}
                  </p>
                </div>
                <Sparkles className="w-12 h-12 text-green-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Inactivas</p>
                  <p className="text-3xl font-bold text-red-700 mt-1">
                    {campanas.filter((c) => !c.esActiva).length}
                  </p>
                </div>
                <Power className="w-12 h-12 text-red-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">
                    Productos Total
                  </p>
                  <p className="text-3xl font-bold text-purple-700 mt-1">
                    {productos.length}
                  </p>
                </div>
                <Package className="w-12 h-12 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar campaña por nombre..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="todos">Todos</option>
                <option value="activas">Activas</option>
                <option value="inactivas">Inactivas</option>
              </select>

              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setVistaMode("cards")}
                  className={`p-2 rounded transition-all ${
                    vistaMode === "cards"
                      ? "bg-white shadow text-purple-600"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setVistaMode("table")}
                  className={`p-2 rounded transition-all ${
                    vistaMode === "table"
                      ? "bg-white shadow text-purple-600"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {cargando ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
          </div>
        ) : campanasActuales.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Tag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No hay campañas
            </h3>
            <p className="text-gray-500 mb-6">
              Crea tu primera campaña para comenzar a gestionar ofertas
            </p>
            <button
              onClick={handleAbrirModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg font-semibold"
            >
              <Plus className="w-5 h-5" />
              Crear Primera Campaña
            </button>
          </div>
        ) : vistaMode === "cards" ? (
          // Vista de Cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {campanasActuales.map((campana) => (
              <div
                key={campana.idCampana}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Header de la card */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">
                        {campana.nombreCampana}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                        {campana.tipo}
                      </span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <span className="text-2xl font-bold">
                        {campana.porcentajeDescuento}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body de la card */}
                <div className="p-4 space-y-3">
                  {campana.descripcion && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {campana.descripcion}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatearFecha(campana.fechaInicio)} -{" "}
                      {formatearFecha(campana.fechaFin)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{campana.cantidadProductos || 0} productos</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        campana.esActiva
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {campana.esActiva ? "✓ Activa" : "⊗ Inactiva"}
                    </span>
                  </div>
                </div>

                {/* Footer con acciones */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editarCampana(campana)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        toggleActiva(campana.idCampana, campana.esActiva)
                      }
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                        campana.esActiva
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      {campana.esActiva ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      onClick={() =>
                        eliminarCampana(
                          campana.idCampana,
                          campana.nombreCampana,
                        )
                      }
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Vista de Tabla
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">
                      Campaña
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold">
                      Descuento
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold">
                      Vigencia
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold">
                      Productos
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campanasActuales.map((campana, index) => (
                    <tr
                      key={campana.idCampana}
                      className={`hover:bg-purple-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {campana.nombreCampana}
                          </p>
                          {campana.descripcion && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {campana.descripcion}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {campana.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-sm font-bold shadow-md">
                          <Percent className="w-4 h-4" />
                          {campana.porcentajeDescuento}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm">
                          <p className="text-gray-600">
                            {formatearFecha(campana.fechaInicio)}
                          </p>
                          <p className="text-gray-400">hasta</p>
                          <p className="text-gray-600">
                            {formatearFecha(campana.fechaFin)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                          <Package className="w-4 h-4" />
                          {campana.cantidadProductos || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            campana.esActiva
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {campana.esActiva ? "✓ Activa" : "⊗ Inactiva"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => editarCampana(campana)}
                            className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              toggleActiva(campana.idCampana, campana.esActiva)
                            }
                            className={`p-2 rounded-lg transition-all ${
                              campana.esActiva
                                ? "bg-red-100 hover:bg-red-200 text-red-600"
                                : "bg-green-100 hover:bg-green-200 text-green-600"
                            }`}
                            title={campana.esActiva ? "Desactivar" : "Activar"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              eliminarCampana(
                                campana.idCampana,
                                campana.nombreCampana,
                              )
                            }
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {[...Array(totalPaginas)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPaginaActual(index + 1)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  paginaActual === index + 1
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setPaginaActual((p) => Math.min(totalPaginas, p + 1))
              }
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar Campaña */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-scaleIn"
          >
            {/* Header del Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 text-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {modoEdicion ? "Editar Campaña" : "Nueva Campaña"}
                  </h2>
                  <p className="text-purple-100 mt-1">
                    {modoEdicion
                      ? "Modifica los datos y productos de la campaña"
                      : "Crea una campaña con múltiples productos"}
                  </p>
                </div>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              {/* Formulario de Campaña */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5">
                <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Datos de la Campaña
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Campaña *
                    </label>
                    <input
                      type="text"
                      value={nuevaCampana.nombreCampana}
                      onChange={(e) =>
                        setNuevaCampana({
                          ...nuevaCampana,
                          nombreCampana: e.target.value,
                        })
                      }
                      placeholder="Ej: Cyber Monday 2026, Ofertas de Primavera, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={nuevaCampana.descripcion}
                      onChange={(e) =>
                        setNuevaCampana({
                          ...nuevaCampana,
                          descripcion: e.target.value,
                        })
                      }
                      placeholder="Descripción breve de la campaña..."
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Porcentaje de Descuento * (%)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={nuevaCampana.porcentajeDescuento}
                        onChange={(e) =>
                          setNuevaCampana({
                            ...nuevaCampana,
                            porcentajeDescuento: e.target.value,
                          })
                        }
                        placeholder="Ej: 15, 25, 50"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Campaña
                    </label>
                    <select
                      value={nuevaCampana.tipo}
                      onChange={(e) =>
                        setNuevaCampana({
                          ...nuevaCampana,
                          tipo: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="DESCUENTO">Descuento</option>
                      <option value="EVENTO">Evento</option>
                      <option value="LIQUIDACION">Liquidación</option>
                      <option value="TEMPORADA">Temporada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      value={nuevaCampana.fechaInicio}
                      onChange={(e) =>
                        setNuevaCampana({
                          ...nuevaCampana,
                          fechaInicio: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Fin *
                    </label>
                    <input
                      type="date"
                      value={nuevaCampana.fechaFin}
                      onChange={(e) =>
                        setNuevaCampana({
                          ...nuevaCampana,
                          fechaFin: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Sección de Productos */}
              <div className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Productos de la Campaña ({
                      productosSeleccionados.length
                    }{" "}
                    seleccionados)
                  </h3>
                  <button
                    onClick={seleccionarTodos}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    {productosSeleccionados.length ===
                    productosDisponibles.length
                      ? "Desmarcar Todos"
                      : "Seleccionar Todos"}
                  </button>
                </div>

                {/* Filtros de Productos */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={busquedaProducto}
                        onChange={(e) => setBusquedaProducto(e.target.value)}
                        placeholder="Buscar producto..."
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {busquedaProducto && (
                        <button
                          onClick={() => setBusquedaProducto("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="min-w-[200px]">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none"
                      >
                        <option value="">Todas las categorías</option>
                        {categorias.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(busquedaProducto || categoriaFiltro) && (
                    <button
                      onClick={() => {
                        setBusquedaProducto("");
                        setCategoriaFiltro("");
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>

                {/* Grid de Productos */}
                <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  {productosDisponibles.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No se encontraron productos
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-3">
                        {productosDisponibles.length} productos encontrados
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {productosDisponibles.map((producto) => (
                          <div
                            key={producto.idProducto}
                            onClick={() =>
                              toggleProductoSeleccion(producto.idProducto)
                            }
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                              productosSeleccionados.includes(
                                producto.idProducto,
                              )
                                ? "bg-purple-50 border-purple-500"
                                : "bg-white border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            <div className="shrink-0">
                              {productosSeleccionados.includes(
                                producto.idProducto,
                              ) ? (
                                <CheckSquare className="w-5 h-5 text-purple-600" />
                              ) : (
                                <Square className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="w-12 h-12 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={getProductoImageUrl(producto)}
                                alt={producto.nombreProducto}
                                className="w-full h-full object-contain"
                                onError={(e) => (e.target.src = Default)}
                              />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {producto.nombreProducto}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {producto.categoria}
                              </p>
                              <p className="text-sm font-bold text-purple-600">
                                ${producto.precio}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={modoEdicion ? actualizarCampana : crearCampana}
                  disabled={
                    !nuevaCampana.nombreCampana ||
                    !nuevaCampana.porcentajeDescuento ||
                    productosSeleccionados.length === 0
                  }
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {modoEdicion ? "Actualizar Campaña" : "Crear Campaña"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampanas;
