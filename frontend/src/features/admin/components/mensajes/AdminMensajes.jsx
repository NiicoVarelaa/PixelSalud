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
    <AdminLayout
      title="Gestión de Mensajes"
      description="Administra los mensajes recibidos de los clientes"
    >
      <MensajesFilters
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        onLimpiar={limpiarFiltros}
      />

      {error && <ErrorBanner error={error} />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : mensajesFiltrados.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full">
            <MensajesTable
              mensajes={mensajesFiltrados}
              onVerDetalle={handleVerDetalle}
              onResponder={handleResponder}
              onArchivar={handleArchivar}
              onEliminar={eliminarMensaje}
            />
          </table>
        )}
      </div>

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

      <ToastContainer position="bottom-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default AdminMensajes;
