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

  const { filtros, handleFiltroChange, limpiarFiltros, irAPagina } =
    useAuditoriaFilters();

  const { auditorias, loading, error, cargarAuditorias } =
    useAuditoriaData(filtros);

  const paginaActual = Math.floor(filtros.offset / filtros.limite) + 1;
  const totalPaginas =
    auditorias.length === filtros.limite ? paginaActual + 1 : paginaActual;

  const verDetalles = (auditoria) => {
    setAuditoriaSeleccionada(auditoria);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setAuditoriaSeleccionada(null);
  };

  const paginationProps = {
    totalRegistros: auditorias.length,
    offset: filtros.offset,
    limite: filtros.limite,
    totalPaginas,
    onCambiarPagina: irAPagina,
    onCambiarLimite: (v) => handleFiltroChange("limite", v),
  };

  return (
    <AdminLayout
      title="Auditoria"
      description="Seguimiento de acciones y cambios en el sistema"
    >
      <div className="mb-2 shrink-0">
        <AuditoriaFilters
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          onLimpiar={limpiarFiltros}
          onBuscar={cargarAuditorias}
        />
      </div>

      {error && <ErrorBanner error={error} />}

      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <LoadingState />
        ) : auditorias.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="md:hidden space-y-2.5">
              {auditorias.map((a, i) => (
                <AuditoriaCard
                  key={a.idAuditoria}
                  auditoria={a}
                  index={i}
                  onVerDetalles={verDetalles}
                />
              ))}
            </div>

            <div className="hidden md:block">
              <AuditoriaTable
                auditorias={auditorias}
                onVerDetalles={verDetalles}
              />
            </div>
          </>
        )}
      </div>

      {!loading && auditorias.length > 0 && (
        <div className="mt-3 shrink-0">
          <AuditoriaPagination {...paginationProps} />
        </div>
      )}

      <AuditoriaModal
        auditoria={auditoriaSeleccionada}
        isOpen={mostrarModal}
        onClose={cerrarModal}
      />
    </AdminLayout>
  );
};

export default AdminAuditoria;
