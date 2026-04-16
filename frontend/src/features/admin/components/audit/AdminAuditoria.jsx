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
      title="Auditoría"
      description="Registro completo de acciones críticas del sistema"
      contentClassName="flex h-full min-h-0 flex-col gap-3"
    >
      <AuditoriaFilters
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        onLimpiar={limpiarFiltros}
        onBuscar={cargarAuditorias}
      />

      {error && <ErrorBanner error={error} />}

      <div className="flex flex-col gap-2 md:hidden">
        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white">
            <LoadingState />
          </div>
        ) : auditorias.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white">
            <EmptyState />
          </div>
        ) : (
          <>
            {auditorias.map((a, i) => (
              <AuditoriaCard
                key={a.idAuditoria}
                auditoria={a}
                index={i}
                onVerDetalles={verDetalles}
              />
            ))}
            <div className="rounded-xl border border-gray-200 bg-white">
              <AuditoriaPagination {...paginationProps} />
            </div>
          </>
        )}
      </div>

      <div className="hidden min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs md:flex">
        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <table className="w-full">
              <tbody>
                <LoadingState asTableRow />
              </tbody>
            </table>
          ) : auditorias.length === 0 ? (
            <table className="w-full">
              <tbody>
                <EmptyState asTableRow />
              </tbody>
            </table>
          ) : (
            <AuditoriaTable
              auditorias={auditorias}
              onVerDetalles={verDetalles}
            />
          )}
        </div>

        {!loading && auditorias.length > 0 && (
          <div className="shrink-0 border-t border-gray-100">
            <AuditoriaPagination {...paginationProps} />
          </div>
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
