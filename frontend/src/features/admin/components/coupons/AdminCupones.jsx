import { useState } from "react";
import { Plus } from "lucide-react";
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
} from "./components";

const AdminCupones = () => {
  const [vistaActual, setVistaActual] = useState("cupones");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const {
    cupones,
    historial,
    clientes,
    cargandoClientes,
    cargando,
    crearCupon,
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

  const handleCambiarEstado = (id, estadoActual) => {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";
    setConfirmDialog({
      isOpen: true,
      title: "¿Cambiar estado del cupón?",
      message: `El cupón será ${nuevoEstado === "activo" ? "activado" : "desactivado"}.`,
      onConfirm: () => cambiarEstado(id, estadoActual),
    });
  };

  const handleEliminar = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: "¿Eliminar cupón?",
      message: "Esta acción no se puede deshacer.",
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

  return (
    <AdminLayout
      title="Cupones"
      description="Administrá cupones de descuento y su historial de uso"
      contentClassName="flex h-full min-h-0 flex-col gap-3"
      headerAction={
        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-green-700 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          <Plus size={15} aria-hidden="true" />
          Crear cupón
        </button>
      }
    >
      <StatsCards estadisticas={estadisticas} />

      <TabNavigation
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        totalCupones={cupones.length}
      />

      {vistaActual === "cupones" ? (
        <div
          className="flex min-h-0 flex-1 flex-col gap-3"
          role="tabpanel"
          id="panel-cupones"
          aria-labelledby="tab-cupones"
        >
          <CuponesFilters
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
            onResetPaginacion={resetPaginacion}
          />

          <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
            {cargando ? (
              <LoadingState />
            ) : cuponesPaginados.length === 0 ? (
              <EmptyState mensaje="No se encontraron cupones" />
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                {/* Mobile: cards */}
                <div className="block min-h-0 flex-1 overflow-y-auto p-3 md:hidden">
                  <div className="grid gap-2.5">
                    {cuponesPaginados.map((cupon, i) => (
                      <CuponCard
                        key={cupon.idCupon}
                        cupon={cupon}
                        index={i}
                        onCambiarEstado={handleCambiarEstado}
                        onEliminar={handleEliminar}
                      />
                    ))}
                  </div>
                </div>

                {/* Desktop: tabla */}
                <div className="hidden min-h-0 flex-1 overflow-y-auto md:block">
                  <CuponTable
                    cupones={cuponesPaginados}
                    onCambiarEstado={handleCambiarEstado}
                    onEliminar={handleEliminar}
                  />
                </div>

                <div className="shrink-0 border-t border-gray-100 bg-white/95 px-4 py-3">
                  <CuponesPagination
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    indicePrimero={indicePrimero}
                    indiceUltimo={indiceUltimo}
                    totalItems={cuponesFiltrados.length}
                    onCambiarPagina={setPaginaActual}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="min-h-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs"
          role="tabpanel"
          id="panel-historial"
          aria-labelledby="tab-historial"
        >
          <HistorialTable historial={historial} />
        </div>
      )}

      <CuponModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={handleCrearCupon}
        clientes={clientes}
        cargandoClientes={cargandoClientes}
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
