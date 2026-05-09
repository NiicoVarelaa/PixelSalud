import { useState } from "react";
import { AdminLayout } from "@features/admin/components/shared";
import { useCuponesData } from "./hooks/useCuponesData";
import { useCuponesFilters } from "./hooks/useCuponesFilters";
import {
  StatsCards,
  TabNavigation,
  CuponesFilters,
  CuponCard,
  CuponTable,
  HistorialTable,
  CuponesPagination,
  ConfirmDialog,
  CuponModal,
  LoadingState,
  EmptyState,
  CuponDetail,
  HistorialFilters,
} from "./components";

const AdminCupones = () => {
  const [vistaActual, setVistaActual] = useState("cupones");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cuponEditando, setCuponEditando] = useState(null);
  const [cuponDetalle, setCuponDetalle] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [historialBusqueda, setHistorialBusqueda] = useState("");
  const [historialFiltroCodigo, setHistorialFiltroCodigo] = useState("todos");

  const {
    cupones,
    historial,
    clientes,
    cargandoClientes,
    cargando,
    crearCupon,
    editarCupon,
    cambiarEstado,
    eliminarCupon,
    estadisticas,
  } = useCuponesData();

  const {
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroTipo,
    setFiltroTipo,
    paginaActual,
    setPaginaActual,
    cuponesFiltrados,
    cuponesPaginados,
    totalPaginas,
    indicePrimero,
    indiceUltimo,
    resetPaginacion,
  } = useCuponesFilters(cupones);

  const handleCrearCupon = async (formData) => {
    const success = await crearCupon(formData, () => setModalAbierto(false));
    return success;
  };

  const handleEditarCupon = async (formData) => {
    const success = await editarCupon(
      cuponEditando.idCupon,
      formData,
      () => {
        setModalAbierto(false);
        setCuponEditando(null);
      }
    );
    return success;
  };

  const abrirModalEdicion = (cupon) => {
    setCuponEditando(cupon);
    setModalAbierto(true);
  };

  const abrirDetalle = (cupon) => {
    setCuponDetalle(cupon);
  };

  const cerrarDetalle = () => {
    setCuponDetalle(null);
  };

  const handleCambiarEstado = (id, estadoActual) => {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";
    setConfirmDialog({
      isOpen: true,
      title: "Cambiar estado del cupon",
      message: `El cupon sera ${nuevoEstado === "activo" ? "activado" : "desactivado"}.`,
      onConfirm: () => cambiarEstado(id, estadoActual),
    });
  };

  const handleEliminar = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: "Eliminar cupon",
      message: "Esta accion no se puede deshacer.",
      onConfirm: () => eliminarCupon(id),
    });
  };

  const closeConfirmDialog = () =>
    setConfirmDialog({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });

  const historialFiltrado = historial.filter((uso) => {
    const matchBusqueda =
      uso.codigo?.toLowerCase().includes(historialBusqueda.toLowerCase()) ||
      uso.nombreCliente?.toLowerCase().includes(historialBusqueda.toLowerCase()) ||
      uso.emailCliente?.toLowerCase().includes(historialBusqueda.toLowerCase());
    const matchCodigo =
      historialFiltroCodigo === "todos" || uso.codigo === historialFiltroCodigo;
    return matchBusqueda && matchCodigo;
  });

  const codigosUnicos = [...new Set(historial.map((u) => u.codigo))].map((c) => ({
    value: c,
    label: c,
  }));

  return (
    <AdminLayout
      title="Cupones"
      description={`${cuponesFiltrados.length} cupon${cuponesFiltrados.length !== 1 ? "es" : ""} encontrado${cuponesFiltrados.length !== 1 ? "s" : ""}`}
    >
      <StatsCards estadisticas={estadisticas} />

      <TabNavigation
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        totalCupones={cupones.length}
      />

      {vistaActual === "cupones" ? (
        <div
          className="flex min-h-0 flex-1 flex-col"
          role="tabpanel"
          id="panel-cupones"
          aria-labelledby="tab-cupones"
        >
          <div className="mb-2 shrink-0">
            <CuponesFilters
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              filtroEstado={filtroEstado}
              setFiltroEstado={setFiltroEstado}
              filtroTipo={filtroTipo}
              setFiltroTipo={setFiltroTipo}
              onResetPaginacion={resetPaginacion}
              onCrearCupon={() => {
                setCuponEditando(null);
                setModalAbierto(true);
              }}
              cuponesFiltrados={cuponesFiltrados}
            />
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {cargando ? (
              <LoadingState />
            ) : cuponesPaginados.length === 0 ? (
              <EmptyState mensaje="No se encontraron cupones" />
            ) : (
              <>
                <div className="block md:hidden">
                  <div className="grid gap-2.5">
                    {cuponesPaginados.map((cupon, i) => (
                      <CuponCard
                        key={cupon.idCupon}
                        cupon={cupon}
                        index={i}
                        onCambiarEstado={handleCambiarEstado}
                        onEliminar={handleEliminar}
                        onEditar={abrirModalEdicion}
                        onVerDetalle={abrirDetalle}
                      />
                    ))}
                  </div>
                </div>

                <div className="hidden md:block">
                  <CuponTable
                    cupones={cuponesPaginados}
                    onCambiarEstado={handleCambiarEstado}
                    onEliminar={handleEliminar}
                    onEditar={abrirModalEdicion}
                    onVerDetalle={abrirDetalle}
                  />
                </div>
              </>
            )}
          </div>

          {cuponesFiltrados.length > 0 && (
            <div className="mt-3 shrink-0">
              <CuponesPagination
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                indicePrimero={indicePrimero}
                indiceUltimo={indiceUltimo}
                totalItems={cuponesFiltrados.length}
                onCambiarPagina={setPaginaActual}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          className="min-h-0 flex-1 overflow-hidden rounded-xl border border-gray-100 bg-white"
          role="tabpanel"
          id="panel-historial"
          aria-labelledby="tab-historial"
        >
          <HistorialFilters
            busqueda={historialBusqueda}
            setBusqueda={setHistorialBusqueda}
            filtroCodigo={historialFiltroCodigo}
            setFiltroCodigo={setHistorialFiltroCodigo}
            opcionesCodigo={codigosUnicos}
          />
          <HistorialTable historial={historialFiltrado} />
        </div>
      )}

      <CuponModal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setCuponEditando(null);
        }}
        onSubmit={cuponEditando ? handleEditarCupon : handleCrearCupon}
        clientes={clientes}
        cargandoClientes={cargandoClientes}
        cuponEditar={cuponEditando}
      />

      <CuponDetail
        cupon={cuponDetalle}
        onClose={cerrarDetalle}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </AdminLayout>
  );
};

export default AdminCupones;
