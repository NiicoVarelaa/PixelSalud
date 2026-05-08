import { useEffect, useState } from "react";
import { AdminLayout } from "@features/admin/components/shared";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMensajesData } from "./hooks/useMensajesData";
import { useMensajesFilters } from "./hooks/useMensajesFilters";
import {
  MensajesFilters,
  MensajesTable,
  MensajeDetalle,
  MensajeRespuesta,
  LoadingState,
  EmptyState,
  ErrorBanner,
} from "./components";
import PaginationProductos from "@features/admin/components/products/components/Pagination";

const AdminMensajes = () => {
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);

  const {
    mensajes,
    loading,
    error,
    fetchMensajes,
    marcarLeido,
    cambiarEstado,
    eliminarMensaje,
    enviarRespuesta,
  } = useMensajesData();

  const {
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    mensajesFiltrados,
    mensajesPaginados,
    paginaActual,
    totalPaginas,
    handleCambiarPagina,
  } = useMensajesFilters(mensajes);

  useEffect(() => {
    fetchMensajes();
  }, [fetchMensajes]);

  const handleVerDetalle = (mensaje) => {
    setMensajeSeleccionado(mensaje);
    setMostrarDetalle(true);
  };

  const handleResponder = (mensaje) => {
    setMensajeSeleccionado(mensaje);
    setMostrarRespuesta(true);
  };

  const handleArchivar = (idMensaje) => {
    cambiarEstado(idMensaje, "cerrado");
  };

  return (
    <>
      <AdminLayout
        title="Mensajes"
        description={`${mensajesFiltrados.length} mensaje${mensajesFiltrados.length !== 1 ? "s" : ""} recibido${mensajesFiltrados.length !== 1 ? "s" : ""}`}
      >
        <div className="mb-2 shrink-0">
          <MensajesFilters
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
          />
        </div>

        {error && <ErrorBanner error={error} />}

        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <LoadingState />
          ) : mensajesFiltrados.length === 0 ? (
            <EmptyState />
          ) : (
            <MensajesTable
              mensajes={mensajesPaginados}
              onVerDetalle={handleVerDetalle}
              onResponder={handleResponder}
              onArchivar={handleArchivar}
              onEliminar={eliminarMensaje}
            />
          )}
        </div>

        {!loading && mensajesFiltrados.length > 0 && (
          <div className="mt-3 shrink-0">
            <PaginationProductos
              currentPage={paginaActual}
              totalPages={totalPaginas}
              onPageChange={handleCambiarPagina}
            />
          </div>
        )}

        <MensajeDetalle
          mensaje={mensajeSeleccionado}
          isOpen={mostrarDetalle}
          onClose={() => {
            setMostrarDetalle(false);
            setMensajeSeleccionado(null);
          }}
          onMarcarLeido={marcarLeido}
          onResponder={handleResponder}
          onArchivar={handleArchivar}
          onEliminar={eliminarMensaje}
        />

        <MensajeRespuesta
          mensaje={mensajeSeleccionado}
          isOpen={mostrarRespuesta}
          onClose={() => {
            setMostrarRespuesta(false);
            setMensajeSeleccionado(null);
          }}
          onEnviar={enviarRespuesta}
        />
      </AdminLayout>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        toastClassName="!rounded-xl !text-sm !shadow-lg"
      />
    </>
  );
};

export default AdminMensajes;
