import { useMemo } from "react";
import { useAuthStore } from "@store/useAuthStore";
import { useVentasStore } from "../store/useVentasStore";
import {
  formatearFechaVenta,
  formatearMonedaVenta,
  obtenerItemsPagina,
} from "./ventasTable/utils/ventasTable.utils";
import { VentasDesktopTable } from "./ventasTable/VentasDesktopTable";
import {
  VentasTableEmpty,
  VentasTableLoading,
} from "./ventasTable/VentasTableFeedback";
import { VentasMobileList } from "./ventasTable/VentasMobileList";

export const VentasTable = ({
  onEditar,
  onAnular,
  onReactivar,
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
  } = useVentasStore();

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
    return <VentasTableLoading />;
  }

  if (itemsActuales.length === 0) {
    return <VentasTableEmpty filtro={filtro} filtroEstado={filtroEstado} />;
  }

  return (
    <>
      <VentasMobileList
        items={itemsActuales}
        permisos={permisos}
        onAnular={onAnular}
        onEditar={onEditar}
        onPrintTicket={onPrintTicket}
        onReactivar={onReactivar}
        formatearFecha={formatearFechaVenta}
        formatearMoneda={formatearMonedaVenta}
      />

      <VentasDesktopTable
        items={itemsActuales}
        permisos={permisos}
        onAnular={onAnular}
        onEditar={onEditar}
        onPrintTicket={onPrintTicket}
        onReactivar={onReactivar}
        formatearFecha={formatearFechaVenta}
        formatearMoneda={formatearMonedaVenta}
      />
    </>
  );
};
