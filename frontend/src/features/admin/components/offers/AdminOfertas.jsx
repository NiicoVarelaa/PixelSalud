import { useEffect, useMemo, useState } from "react";
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
  const { productos, setItemsPorPagina } = useOfertasStore();

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

  useEffect(() => {
    const getItemsPorPagina = (width) => {
      if (width < 640) return 3;
      if (width < 1024) return 4;
      return 6;
    };

    const applyResponsivePagination = () => {
      setItemsPorPagina(getItemsPorPagina(window.innerWidth));
    };

    applyResponsivePagination();
    window.addEventListener("resize", applyResponsivePagination);

    return () => {
      window.removeEventListener("resize", applyResponsivePagination);
    };
  }, [setItemsPorPagina]);

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
      description="Gestiona descuentos puntuales por producto con una vista simple y accionable"
      usePageScroll={false}
      contentClassName="flex h-full min-h-0 flex-col pb-2"
    >
      <div
        className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4"
        role="main"
        aria-label="Panel de ofertas"
      >
        <section aria-label="Filtros de productos para ofertas">
          <OfertasFilters
            categorias={categorias}
            onOpenAgregarOferta={() => setModalAgregarAbierto(true)}
          />
        </section>

        <section
          aria-label="Listado de productos en oferta"
          className="flex flex-col gap-3 lg:min-h-0 lg:flex-1"
        >
          <div className="lg:min-h-0 lg:flex-1">
            <OfertasTable
              onEstablecerDescuento={abrirModalDescuento}
              onCambiarOferta={handleCambiarOferta}
              estaEnCampana={estaEnCampana}
            />
          </div>

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
