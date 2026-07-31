import { useMemo } from "react";
import { useAuthStore } from "@store/useAuthStore";
import { useVentasOnlineStore } from "../store/useVentasOnlineStore";
import { VentasOnlineDesktopTable } from "./ventasOnlineTable/VentasOnlineDesktopTable";
import { VentasOnlineMobileList } from "./ventasOnlineTable/VentasOnlineMobileList";
import {
  VentasOnlineTableEmpty,
  VentasOnlineTableLoading,
} from "./ventasOnlineTable/VentasOnlineTableFeedback";
import {
  formatearFechaVentaOnline,
  formatearMonedaVentaOnline,
  obtenerItemsPagina,
} from "./ventasOnlineTable/utils/ventasOnlineTable.utils";

export const VentasOnlineTable = ({
  onEditar,
  onEstadoChange,
  onPrintTicket,
}) => {
  const { user } = useAuthStore();
  const permisos = user?.permisos || {};

  const {
    cargando,
    ventas,
    filtro,
    filtroEstado,
    filtroOrden,
    paginaActual,
    itemsPorPagina,
  } = useVentasOnlineStore();

  const itemsActuales = useMemo(() => {
    return obtenerItemsPagina({
      ventas,
      filtro,
      filtroEstado,
      filtroOrden,
      paginaActual,
      itemsPorPagina,
    });
  }, [ventas, filtro, filtroEstado, filtroOrden, paginaActual, itemsPorPagina]);

  if (cargando) {
    return <VentasOnlineTableLoading />;
  }

  if (itemsActuales.length === 0) {
    return (
      <VentasOnlineTableEmpty filtro={filtro} filtroEstado={filtroEstado} />
    );
  }

  return (
    <>
      <VentasOnlineMobileList
        items={itemsActuales}
        permisos={permisos}
        onEditar={onEditar}
        onEstadoChange={onEstadoChange}
        onPrintTicket={onPrintTicket}
        formatearFecha={formatearFechaVentaOnline}
        formatearMoneda={formatearMonedaVentaOnline}
      />

      <VentasOnlineDesktopTable
        items={itemsActuales}
        permisos={permisos}
        onEditar={onEditar}
        onEstadoChange={onEstadoChange}
        onPrintTicket={onPrintTicket}
        formatearFecha={formatearFechaVentaOnline}
        formatearMoneda={formatearMonedaVentaOnline}
      />
    </>
  );
};
