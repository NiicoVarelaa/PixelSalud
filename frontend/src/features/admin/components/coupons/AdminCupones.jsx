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
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Gestión de Cupones
        </h1>
        <p className="text-gray-600">
          Administra cupones de descuento y visualiza su historial de uso
        </p>
      </div>

      <StatsCards estadisticas={estadisticas} />

      <TabNavigation
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        totalCupones={cupones.length}
      />

      {vistaActual === "cupones" ? (
        <>
          {/* Botón Crear */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalAbierto(true)}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Crear Cupón
          </motion.button>

          <CuponesFilters
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
            onResetPaginacion={resetPaginacion}
          />

          {cargando ? (
            <LoadingState />
          ) : cuponesPaginados.length === 0 ? (
            <EmptyState mensaje="No se encontraron cupones" />
          ) : (
            <>
              {/* Vista Mobile */}
              <div className="block md:hidden">
                <div className="grid gap-4">
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
              <div className="hidden md:block">
                <CuponTable
                  cupones={cuponesPaginados}
                  onCambiarEstado={handleCambiarEstado}
                  onEliminar={handleEliminar}
                />
              </div>

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
                  setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
                }
              />
            </>
          )}
        </>
      ) : (
        /* Vista Historial */
        <HistorialTable historial={historial} />
      )}

      {/* Modal Crear Cupón */}
      <CuponModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={handleCrearCupon}
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
