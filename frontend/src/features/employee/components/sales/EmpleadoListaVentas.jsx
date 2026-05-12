import { useState, useEffect, useCallback, useMemo } from "react";
import apiClient from "@utils/apiClient";
import { useAuthStore } from "@store/useAuthStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Receipt } from "lucide-react";
import TicketVenta from "@features/admin/components/sales/shared/TicketVenta";
import VentasFilters from "./panels/VentasFilters";
import VentasTableRow from "./panels/VentasTableRow";
import VentasPagination from "./panels/VentasPagination";
import { ConfirmAnularDialog, ConfirmReactivarDialog, DetalleModal } from "./dialogs";

const ITEMS_POR_PAGINA = 9;

const Skeleton = () => (
  <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-green-200 border-t-green-600" />
      <p className="text-sm text-gray-400">Cargando ventas...</p>
    </div>
  </div>
);

const EmptyState = ({ search }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-4">
      <Receipt size={24} className="text-gray-400" />
    </div>
    {search ? (
      <><p className="text-sm font-semibold text-gray-700">Sin resultados</p><p className="mt-1 text-xs text-gray-400">No se encontraron ventas con "{search}"</p></>
    ) : (
      <><p className="text-sm font-semibold text-gray-700">No hay ventas</p><p className="mt-1 text-xs text-gray-400">Aún no se registraron ventas</p></>
    )}
  </div>
);

const EmpleadoListaVentas = ({ endpoint, title }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const permisos = user?.permisos || {};

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [filtroOrden, setFiltroOrden] = useState("mas_nuevo");
  const [paginaActual, setPaginaActual] = useState(1);

  const [ticketModal, setTicketModal] = useState({ show: false, idVenta: null });
  const [detalleModal, setDetalleModal] = useState({ show: false, idVenta: null });
  const [anularModal, setAnularModal] = useState({ show: false, idVenta: null });
  const [reactivarModal, setReactivarModal] = useState({ show: false, idVenta: null });
  const [anulando, setAnulando] = useState(false);
  const [reactivando, setReactivando] = useState(false);

  const cargarVentas = useCallback(async () => {
    setLoading(true);
    try {
      const url = typeof endpoint === "function" ? endpoint(user) : endpoint;
      let finalUrl = url;
      if (url === "personal") finalUrl = `/ventasEmpleados/${user.idEmpleado || user.id}`;
      if (url === "general") finalUrl = "/ventasEmpleados";
      const response = await apiClient.get(finalUrl);
      setVentas(Array.isArray(response.data) ? response.data : []);
    } catch {
      setVentas([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, user]);

  useEffect(() => { if (user) cargarVentas(); }, [user, cargarVentas]);
  useEffect(() => { setPaginaActual(1); }, [busqueda, filtroEstado, filtroOrden]);

  const ventasFiltradas = useMemo(() => {
    let resultado = ventas.filter((venta) => {
      const termino = busqueda.toLowerCase();
      const id = venta.idVentaE?.toString() || "";
      const nombre = (venta.nombreEmpleado || "").toLowerCase();
      const apellido = (venta.apellidoEmpleado || "").toLowerCase();
      const coincideBusqueda = !busqueda || id.includes(termino) || `${nombre} ${apellido}`.includes(termino);
      const coincideEstado = filtroEstado === "todas" || venta.estado === filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
    resultado.sort((a, b) => {
      const dateA = new Date(`${a.fechaPago} ${a.horaPago || ""}`);
      const dateB = new Date(`${b.fechaPago} ${b.horaPago || ""}`);
      return filtroOrden === "mas_nuevo" ? dateB - dateA : dateA - dateB;
    });
    return resultado;
  }, [ventas, busqueda, filtroEstado, filtroOrden]);

  const totalPaginas = Math.max(1, Math.ceil(ventasFiltradas.length / ITEMS_POR_PAGINA));
  const ventasActuales = ventasFiltradas.slice((paginaActual - 1) * ITEMS_POR_PAGINA, paginaActual * ITEMS_POR_PAGINA);

  const handleConfirmAnular = async () => {
    if (!anularModal.idVenta) return;
    setAnulando(true);
    try {
      await apiClient.put(`/ventasEmpleados/anular/${anularModal.idVenta}`);
      setAnularModal({ show: false, idVenta: null });
      toast.success(`La venta #${anularModal.idVenta} fue anulada.`);
      cargarVentas();
    } catch {
      toast.error("No se pudo anular la venta.");
    } finally {
      setAnulando(false);
    }
  };

  const handleConfirmReactivar = async () => {
    if (!reactivarModal.idVenta) return;
    setReactivando(true);
    try {
      await apiClient.put(`/ventasEmpleados/reactivar/${reactivarModal.idVenta}`);
      setReactivarModal({ show: false, idVenta: null });
      toast.success(`La venta #${reactivarModal.idVenta} está activa.`);
      cargarVentas();
    } catch {
      toast.error("No se pudo reactivar (revise stock).");
    } finally {
      setReactivando(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50"><Receipt size={18} className="text-green-600" /></div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-400">{ventasFiltradas.length} venta{ventasFiltradas.length !== 1 ? "s" : ""} registrada{ventasFiltradas.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <VentasFilters busqueda={busqueda} setBusqueda={setBusqueda} filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado} filtroOrden={filtroOrden} setFiltroOrden={setFiltroOrden} />

      <div className="flex-1 min-h-0">
        {loading ? <Skeleton /> : ventasFiltradas.length === 0 ? <EmptyState search={busqueda} /> : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/50">
                  <tr>
                    {["ID", "Empleado", "Fecha", "Hora", "Método", "Total", "Estado", "Acciones"].map((col, i) => (
                      <th key={col} className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 ${i === 5 ? "text-right" : i >= 6 ? "text-center" : "text-left"}`}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ventasActuales.map((venta) => (
                    <VentasTableRow key={venta.idVentaE} venta={venta} permisos={permisos}
                      onVerDetalle={(id) => setDetalleModal({ show: true, idVenta: id })}
                      onImprimir={(id) => setTicketModal({ show: true, idVenta: id })}
                      onEditar={(id) => navigate(`/panelempleados/editar-venta/${id}`)}
                      onAnular={(id) => setAnularModal({ show: true, idVenta: id })}
                      onReactivar={(id) => setReactivarModal({ show: true, idVenta: id })} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <VentasPagination paginaActual={paginaActual} totalPaginas={totalPaginas} onPageChange={setPaginaActual} />

      <TicketVenta idVenta={ticketModal.idVenta} tipo="empleado" show={ticketModal.show} onClose={() => setTicketModal({ show: false, idVenta: null })} />
      <DetalleModal isOpen={detalleModal.show} onClose={() => setDetalleModal({ show: false, idVenta: null })} idVenta={detalleModal.idVenta} />
      <ConfirmAnularDialog isOpen={anularModal.show} isLoading={anulando} onClose={() => setAnularModal({ show: false, idVenta: null })} onConfirm={handleConfirmAnular} idVenta={anularModal.idVenta} />
      <ConfirmReactivarDialog isOpen={reactivarModal.show} isLoading={reactivando} onClose={() => setReactivarModal({ show: false, idVenta: null })} onConfirm={handleConfirmReactivar} idVenta={reactivarModal.idVenta} />
    </div>
  );
};

export default EmpleadoListaVentas;
