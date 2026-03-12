import { useState } from "react";
import { AdminLayout } from "@features/admin/components/shared";
import { useAuditoriaData } from "./hooks/useAuditoriaData";
import { useAuditoriaFilters } from "./hooks/useAuditoriaFilters";
import {
  AuditoriaFilters,
  AuditoriaTable,
  AuditoriaCard,
  AuditoriaModal,
  AuditoriaPagination,
  LoadingState,
  EmptyState,
  ErrorBanner,
} from "./components";

const AdminAuditoria = () => {
  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const {
    filtros,
    handleFiltroChange,
    limpiarFiltros,
    paginaAnterior,
    paginaSiguiente,
  } = useAuditoriaFilters();

  const { auditorias, loading, error, cargarAuditorias } =
    useAuditoriaData(filtros);

  const verDetalles = (auditoria) => {
    setAuditoriaSeleccionada(auditoria);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setAuditoriaSeleccionada(null);
  };

  return (
    <AdminLayout
      title="Auditoría del Sistema"
      description="Registro completo de todas las acciones críticas del sistema"
    >
      <AuditoriaFilters
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        onLimpiar={limpiarFiltros}
        onBuscar={cargarAuditorias}
      />

      {error && <ErrorBanner error={error} />}

      {/* Vista Mobile */}
      <div className="block md:hidden mb-6">
        <div className="grid gap-4">
          {loading ? (
            <div className="bg-white rounded-lg p-12">
              <LoadingState />
            </div>
          ) : auditorias.length === 0 ? (
            <div className="bg-white rounded-lg p-12">
              <EmptyState />
            </div>
          ) : (
            <>
              {auditorias.map((auditoria) => (
                <AuditoriaCard
                  key={auditoria.idAuditoria}
                  auditoria={auditoria}
                  onVerDetalles={verDetalles}
                />
              ))}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <AuditoriaPagination
                  totalRegistros={auditorias.length}
                  offset={filtros.offset}
                  limite={filtros.limite}
                  onAnterior={paginaAnterior}
                  onSiguiente={paginaSiguiente}
                  onCambiarLimite={(nuevoLimite) =>
                    handleFiltroChange("limite", nuevoLimite)
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Vista Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <AuditoriaTable auditorias={auditorias} onVerDetalles={verDetalles} />
          {loading && <LoadingState />}
          {!loading && auditorias.length === 0 && <EmptyState />}
        </table>

        {!loading && auditorias.length > 0 && (
          <AuditoriaPagination
            totalRegistros={auditorias.length}
            offset={filtros.offset}
            limite={filtros.limite}
            onAnterior={paginaAnterior}
            onSiguiente={paginaSiguiente}
            onCambiarLimite={(nuevoLimite) =>
              handleFiltroChange("limite", nuevoLimite)
            }
          />
        )}
      </div>

      <AuditoriaModal
        auditoria={auditoriaSeleccionada}
        isOpen={mostrarModal}
        onClose={cerrarModal}
      />
    </AdminLayout>
  );
};

export default AdminAuditoria;
