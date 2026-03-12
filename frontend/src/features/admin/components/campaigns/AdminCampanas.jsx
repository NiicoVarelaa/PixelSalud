import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import { AdminLayout } from "@features/admin/components/shared";
import { useProductStore } from "@store/useProductStore";
import { useCampanasData } from "./hooks/useCampanasData";
import { useCampanasFilters } from "./hooks/useCampanasFilters";
import {
  StatsCards,
  CampanasFilters,
  CampanaCard,
  CampanaTable,
  CampanasPagination,
  CampanaModal,
  ConfirmDialog,
  LoadingState,
  EmptyState,
} from "./components";

const AdminCampanas = () => {
  // Hooks
  const { productos, fetchProducts, categorias } = useProductStore();
  const {
    campanas,
    cargando,
    fetchCampanas,
    crearCampana,
    actualizarCampana,
    toggleActiva,
    eliminarCampana,
    cargarProductosCampana,
  } = useCampanasData();

  // Estados de modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [campanaEditando, setCampanaEditando] = useState(null);

  // Estados de formulario
  const [nuevaCampana, setNuevaCampana] = useState({
    nombreCampana: "",
    descripcion: "",
    porcentajeDescuento: "",
    fechaInicio: "",
    fechaFin: "",
    tipo: "DESCUENTO",
  });

  // Estados de productos
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  // Estados de vista
  const [vistaMode, setVistaMode] = useState("cards");
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Estado de confirmación
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
  });

  const ITEMS_PER_PAGE = vistaMode === "cards" ? 9 : 8;

  const { campanasActuales, totalPaginas } = useCampanasFilters({
    campanas,
    busqueda,
    filtroEstado,
    paginaActual,
    itemsPorPagina: ITEMS_PER_PAGE,
  });

  // Cargar datos iniciales
  useEffect(() => {
    fetchCampanas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset página al filtrar
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado, vistaMode]);

  // Handlers
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
    // Aquí deberíamos usar los productos filtrados, pero por simplicidad...
    const todosIds = productos.map((p) => p.idProducto);
    if (productosSeleccionados.length === todosIds.length) {
      setProductosSeleccionados([]);
    } else {
      setProductosSeleccionados(todosIds);
    }
  };

  const handleGuardarCampana = async () => {
    const success = modoEdicion
      ? await actualizarCampana(
          campanaEditando,
          nuevaCampana,
          productosSeleccionados,
        )
      : await crearCampana(nuevaCampana, productosSeleccionados);

    if (success) {
      setModalAbierto(false);
      limpiarFormulario();
    }
  };

  const handleEditarCampana = async (campana) => {
    const productosIds = await cargarProductosCampana(campana.idCampana);

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
    setProductosSeleccionados(productosIds);
    setModalAbierto(true);
  };

  const handleToggleActiva = (campana) => {
    setConfirmDialog({
      isOpen: true,
      title: `¿${campana.esActiva ? "Desactivar" : "Activar"} campaña?`,
      message: `La campaña ${campana.esActiva ? "dejará de aplicarse" : "se aplicará"} a los productos.`,
      type: campana.esActiva ? "danger" : "info",
      onConfirm: () => toggleActiva(campana.idCampana, campana.esActiva),
    });
  };

  const handleEliminarCampana = (campana) => {
    setConfirmDialog({
      isOpen: true,
      title: "¿Eliminar campaña?",
      message: `Se eliminará "${campana.nombreCampana}" y todos sus productos asociados.`,
      type: "danger",
      onConfirm: () => eliminarCampana(campana.idCampana),
    });
  };

  return (
    <AdminLayout
      title="Gestión de Campañas"
      description="Administra campañas de ofertas con múltiples productos"
      headerAction={
        <>
          <ToastContainer position="top-right" autoClose={3000} />
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
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </Link>
          </div>
        </>
      }
    >
      <StatsCards campanas={campanas} productos={productos} />

      <CampanasFilters
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        vistaMode={vistaMode}
        setVistaMode={setVistaMode}
      />

      <div className="mt-4">
        {cargando ? (
          <LoadingState />
        ) : campanasActuales.length === 0 ? (
          <EmptyState onCrearCampana={handleAbrirModal} />
        ) : vistaMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campanasActuales.map((campana, index) => (
              <CampanaCard
                key={campana.idCampana}
                campana={campana}
                index={index}
                onEditar={handleEditarCampana}
                onToggleActiva={handleToggleActiva}
                onEliminar={handleEliminarCampana}
              />
            ))}
          </div>
        ) : (
          <CampanaTable
            campanasActuales={campanasActuales}
            onEditar={handleEditarCampana}
            onToggleActiva={handleToggleActiva}
            onEliminar={handleEliminarCampana}
          />
        )}

        <CampanasPagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPaginaActual}
        />
      </div>

      <CampanaModal
        isOpen={modalAbierto}
        modoEdicion={modoEdicion}
        campana={nuevaCampana}
        onCampanaChange={setNuevaCampana}
        productosSeleccionados={productosSeleccionados}
        onToggleProducto={toggleProductoSeleccion}
        onSeleccionarTodos={seleccionarTodos}
        productos={productos}
        categorias={categorias}
        busquedaProducto={busquedaProducto}
        onBusquedaProductoChange={setBusquedaProducto}
        categoriaFiltro={categoriaFiltro}
        onCategoriaFiltroChange={setCategoriaFiltro}
        onClose={() => setModalAbierto(false)}
        onGuardar={handleGuardarCampana}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onClose={() =>
          setConfirmDialog({ ...confirmDialog, isOpen: false })
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </AdminLayout>
  );
};

export default AdminCampanas;
