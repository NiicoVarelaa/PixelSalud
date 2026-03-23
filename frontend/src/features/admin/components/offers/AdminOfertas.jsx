import { useMemo, useState } from "react";
import { Tags } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@features/admin/components/shared";
import { useOfertasStore } from "./store/useOfertasStore";
import { useOfertasData } from "./hooks/useOfertasData";
import {
  OfertasFilters,
  OfertasTable,
  Pagination,
  ModalDescuento,
  ModalAgregarOferta,
} from "./components";

const AdminOfertas = () => {
  const { productos } = useOfertasStore();

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
      title="Gestión de Ofertas Individuales"
      description="Activa o desactiva ofertas en productos individuales (10%, 15%, 20%)"
      usePageScroll
      contentClassName="pb-2"
    >
      <div
        className="space-y-3 sm:space-y-4"
        role="main"
        aria-label="Panel de ofertas"
      >
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
