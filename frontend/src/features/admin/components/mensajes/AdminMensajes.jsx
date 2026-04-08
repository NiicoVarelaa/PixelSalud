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
    limpiarFiltros,
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
        description="Mensajes recibidos de clientes"
        contentClassName="flex h-full min-h-0 flex-col gap-3"
      >
        {/* Filtros */}
        <MensajesFilters
          filtroEstado={filtroEstado}
          onFiltroEstadoChange={setFiltroEstado}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          onLimpiar={limpiarFiltros}
        />

        {/* Banner de error */}
        {error && <ErrorBanner error={error} />}

        {/* Contenido principal */}
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
          {loading ? (
            <LoadingState />
          ) : mensajesFiltrados.length === 0 ? (
            <EmptyState />
          ) : (
            /*
             * MensajesTable renderiza internamente:
             *  - mobile: lista de <article> cards (no necesita <table> wrapper)
             *  - desktop: <table> con thead/tbody
             *
             * Por eso el wrapper aquí es un <div> neutral,
             * no un <table> como en la versión original.
             */
            <div className="h-full overflow-y-auto">
              <MensajesTable
                mensajes={mensajesFiltrados}
                onVerDetalle={handleVerDetalle}
                onResponder={handleResponder}
                onArchivar={handleArchivar}
                onEliminar={eliminarMensaje}
              />
            </div>
          )}
        </div>

        {/* Modales */}
        <MensajeDetalle
          mensaje={mensajeSeleccionado}
          isOpen={mostrarDetalle}
          onClose={() => { setMostrarDetalle(false); setMensajeSeleccionado(null); }}
          onMarcarLeido={marcarLeido}
          onResponder={handleResponder}
          onArchivar={handleArchivar}
          onEliminar={eliminarMensaje}
        />

        <MensajeRespuesta
          mensaje={mensajeSeleccionado}
          isOpen={mostrarRespuesta}
          onClose={() => { setMostrarRespuesta(false); setMensajeSeleccionado(null); }}
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