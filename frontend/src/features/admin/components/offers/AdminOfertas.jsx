import { useMemo, useState } from "react";
import { BadgePercent, ShieldAlert, Tags } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@features/admin/components/shared";
import { useOfertasStore } from "./store/useOfertasStore";
import { useOfertasData } from "./hooks/useOfertasData";
import { hasActiveOffer } from "./utils/ofertasFilters";
import {
  OfertasFilters,
  OfertasTable,
  Pagination,
  ModalDescuento,
  ModalAgregarOferta,
} from "./components";

const AdminOfertas = () => {
  const { productos, idsProductosEnCampanas } = useOfertasStore();

  // Estado para el modal de descuento
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Hook con lógica de negocio
  const { estaEnCampana, handleCambiarOferta } = useOfertasData();

  // Obtener categorías únicas con useMemo
  const categorias = useMemo(() => {
    return [...new Set(productos.map((p) => p.categoria))].sort();
  }, [productos]);

  const resumen = useMemo(() => {
    const conOfertaActiva = productos.filter((p) => hasActiveOffer(p)).length;
    return {
      total: productos.length,
      conOfertaActiva,
      bloqueadosPorCampana: idsProductosEnCampanas.length,
    };
  }, [productos, idsProductosEnCampanas]);

  // Abrir modal para establecer descuento
  const abrirModalDescuento = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  // Confirmar descuento desde el modal
  const confirmarDescuento = (porcentaje) => {
    if (productoSeleccionado) {
      handleCambiarOferta(productoSeleccionado, true, porcentaje);
    }
  };

  const confirmarAgregarOferta = ({ producto, porcentaje }) => {
    if (!producto) return;
    handleCambiarOferta(producto, true, porcentaje);
  };

  return (
    <AdminLayout
      title="Gestor de Ofertas Individuales"
      description="Controla descuentos puntuales por producto y evita conflictos con campañas activas"
      usePageScroll={false}
      contentClassName="pb-2"
    >
      <div
        className="space-y-2.5 sm:space-y-3"
        role="main"
        aria-label="Panel de ofertas"
      >
        <section
          className="rounded-xl border border-primary-200 bg-linear-to-r from-primary-50 via-white to-emerald-50 px-3 py-3 shadow-sm sm:px-4"
          aria-label="Resumen del estado de ofertas"
        >
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-0.5">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-700">
                <BadgePercent className="h-3.5 w-3.5" aria-hidden="true" />
                Modulo de ofertas
              </p>
              <h2 className="text-base font-bold tracking-tight text-gray-900 sm:text-lg">
                Ajusta descuentos sin perder trazabilidad
              </h2>
              <p className="text-xs text-gray-600 sm:text-sm">
                Productos en campana activa se bloquean automaticamente.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-center shadow-xs">
                <p className="text-xs font-semibold text-gray-500">Productos</p>
                <p className="text-base font-bold text-gray-900">
                  {resumen.total}
                </p>
              </div>
              <div className="rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-center shadow-xs">
                <p className="text-xs font-semibold text-primary-700">
                  Con oferta
                </p>
                <p className="text-base font-bold text-primary-800">
                  {resumen.conOfertaActiva}
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center shadow-xs">
                <p className="text-xs font-semibold text-amber-700">
                  Bloqueados
                </p>
                <p className="text-base font-bold text-amber-800">
                  {resumen.bloqueadosPorCampana}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 inline-flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-900">
            <ShieldAlert
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>
              Regla activa: no se puede superponer una oferta individual con una
              campana vigente.
            </span>
          </div>
        </section>

        <section aria-label="Filtros de productos para ofertas">
          <OfertasFilters
            categorias={categorias}
            onOpenAgregarOferta={() => setModalAgregarAbierto(true)}
          />
        </section>

        <section aria-labelledby="ofertas-listado" className="space-y-3">
          <div className="mb-2 flex items-center gap-2 px-1">
            <Tags className="h-4 w-4 text-primary-600" aria-hidden="true" />
            <h2
              id="ofertas-listado"
              className="text-sm font-semibold text-gray-900"
            >
              Productos disponibles para gestionar ofertas
            </h2>
          </div>

          <OfertasTable
            onEstablecerDescuento={abrirModalDescuento}
            onCambiarOferta={handleCambiarOferta}
            estaEnCampana={estaEnCampana}
          />

          <Pagination />
        </section>
      </div>

      {/* Modal de descuento (reemplaza SweetAlert2) */}
      <ModalDescuento
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setProductoSeleccionado(null);
        }}
        producto={productoSeleccionado}
        onConfirm={confirmarDescuento}
        title="Editar descuento"
        description="Actualiza el porcentaje de descuento para este producto"
        confirmLabel="Aplicar"
      />

      <ModalAgregarOferta
        isOpen={modalAgregarAbierto}
        onClose={() => setModalAgregarAbierto(false)}
        productos={productos}
        categorias={categorias}
        estaEnCampana={estaEnCampana}
        onConfirm={confirmarAgregarOferta}
      />

      {/* Toast global para notificaciones */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </AdminLayout>
  );
};

export default AdminOfertas;
