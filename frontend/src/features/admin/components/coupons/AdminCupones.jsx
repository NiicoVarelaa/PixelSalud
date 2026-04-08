import { useState } from "react";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
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
      message: `El cupón será ${nuevoEstado === "activo" ? "activado" : "desactivado"}`,
      onConfirm: () => cambiarEstado(id, estadoActual),
    });
  };

  const handleEliminar = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: "¿Eliminar cupón?",
      message: "Esta acción no se puede deshacer",
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
      title="Gestión de Cupones"
      description="Administra cupones de descuento y visualiza su historial de uso"
      contentClassName="flex h-full min-h-0 flex-col gap-3"
      headerAction={
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setModalAbierto(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 sm:w-auto"
        >
          <FiPlus className="h-5 w-5" />
          Crear Cupón
        </motion.button>
      }
    >
      <StatsCards estadisticas={estadisticas} />

      <TabNavigation
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        totalCupones={cupones.length}
      />

      {vistaActual === "cupones" ? (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <CuponesFilters
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
            onResetPaginacion={resetPaginacion}
          />

          <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {cargando ? (
              <LoadingState />
            ) : cuponesPaginados.length === 0 ? (
              <EmptyState mensaje="No se encontraron cupones" />
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                {/* Vista Mobile */}
                <div className="block min-h-0 flex-1 overflow-y-auto p-4 md:hidden">
                  <div className="grid gap-3">
                    {cuponesPaginados.map((cupon) => (
                      <CuponCard
                        key={cupon.idCupon}
                        cupon={cupon}
                        onCambiarEstado={handleCambiarEstado}
                        onEliminar={handleEliminar}
                      />
                    ))}
                  </div>
                </div>

                {/* Vista Desktop */}
                <div className="hidden min-h-0 flex-1 overflow-y-auto md:block">
                  <CuponTable
                    cupones={cuponesPaginados}
                    onCambiarEstado={handleCambiarEstado}
                    onEliminar={handleEliminar}
                  />
                </div>

                <div className="shrink-0 border-t border-gray-100 bg-white/95 px-3 py-3 sm:px-4">
                  <CuponesPagination
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    indicePrimero={indicePrimero}
                    indiceUltimo={indiceUltimo}
                    totalItems={cuponesFiltrados.length}
                    onPaginaAnterior={() =>
                      setPaginaActual((prev) => Math.max(prev - 1, 1))
                    }
                    onPaginaSiguiente={() =>
                      setPaginaActual((prev) =>
                        Math.min(prev + 1, totalPaginas),
                      )
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Vista Historial */
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <HistorialTable historial={historial} />
        </div>
      )}

      {/* Modal Crear Cupón */}
      <CuponModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={handleCrearCupon}
        clientes={clientes}
        cargandoClientes={cargandoClientes}
      />

      {/* Diálogo de Confirmación */}
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
