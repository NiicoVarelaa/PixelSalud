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
  const { productos, categorias } = useProductStore();
  const {
    campanas,
    cargando,
    fetchCampanas,
    crearCampana,
    actualizarCampana,
    toggleActiva,
    eliminarCampana,
    cargarProductosCampana,
    cargarIdsProductosEnCampanas,
  } = useCampanasData();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [campanaEditando, setCampanaEditando] = useState(null);

  const [nuevaCampana, setNuevaCampana] = useState({
    nombreCampana: "",
    descripcion: "",
    porcentajeDescuento: "",
    fechaInicio: "",
    fechaFin: "",
    tipo: "DESCUENTO",
  });

  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [idsProductosBloqueados, setIdsProductosBloqueados] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const [vistaMode, setVistaMode] = useState("cards");
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

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

  useEffect(() => {
    fetchCampanas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado, vistaMode]);

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
    setIdsProductosBloqueados([]);
    setBusquedaProducto("");
    setCategoriaFiltro("");
  };

  const handleAbrirModal = async () => {
    limpiarFormulario();
    const idsBloqueados = await cargarIdsProductosEnCampanas();
    setIdsProductosBloqueados(idsBloqueados);
    setModalAbierto(true);
  };

  const toggleProductoSeleccion = (idProducto) => {
    setProductosSeleccionados((prev) =>
      prev.includes(idProducto)
        ? prev.filter((id) => id !== idProducto)
        : [...prev, idProducto],
    );
  };

  const seleccionarTodos = (idsDisponibles = []) => {
    const idsSeleccionables = idsDisponibles;

    if (idsSeleccionables.length === 0) {
      setProductosSeleccionados([]);
      return;
    }

    const todosVisiblesSeleccionados = idsSeleccionables.every((id) =>
      productosSeleccionados.includes(id),
    );

    if (todosVisiblesSeleccionados) {
      setProductosSeleccionados((prev) =>
        prev.filter((id) => !idsSeleccionables.includes(id)),
      );
    } else {
      setProductosSeleccionados((prev) => {
        const merged = new Set([...prev, ...idsSeleccionables]);
        return Array.from(merged);
      });
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
    const idsBloqueados = await cargarIdsProductosEnCampanas({
      excluirCampanaId: campana.idCampana,
    });

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
    setIdsProductosBloqueados(idsBloqueados);
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
    <>
      <AdminLayout
        title="Gestión de Campañas"
        description="Administra campañas de ofertas con múltiples productos"
        contentClassName="flex h-full min-h-0 flex-col gap-4"
        headerAction={
          <div className="flex shrink-0 gap-3">
            <button
              onClick={handleAbrirModal}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-primary-700 bg-primary-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-800"
            >
              <Plus className="h-5 w-5" />
              Nueva Campaña
            </button>
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver
            </Link>
          </div>
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

        <div className="mt-4 min-h-0 flex-1">
          {cargando ? (
            <LoadingState />
          ) : campanasActuales.length === 0 ? (
            <EmptyState onCrearCampana={handleAbrirModal} />
          ) : vistaMode === "cards" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
          idsProductosBloqueados={idsProductosBloqueados}
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
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          confirmText="Confirmar"
          cancelText="Cancelar"
        />
      </AdminLayout>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminCampanas;
