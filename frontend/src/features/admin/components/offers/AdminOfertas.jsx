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
  ConfirmQuitarOfertaDialog,
} from "./components";

const AdminOfertas = () => {
  const { productos, setItemsPorPagina } = useOfertasStore();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalQuitarAbierto, setModalQuitarAbierto] = useState(false);
  const [productoQuitar, setProductoQuitar] = useState(null);
  const [quitandoOferta, setQuitandoOferta] = useState(false);

  const { estaEnCampana, handleCambiarOferta } = useOfertasData();

  const categorias = useMemo(() => {
    return [...new Set(productos.map((p) => p.categoria))].sort();
  }, [productos]);

  useEffect(() => {
    const getItemsPorPagina = (width) => {
      if (width < 640) return 3;
      if (width < 1024) return 4;
      return 7;
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

  const abrirModalDescuento = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const confirmarDescuento = (porcentaje) => {
    if (productoSeleccionado) {
      handleCambiarOferta(productoSeleccionado, true, porcentaje);
    }
  };

  const confirmarAgregarOferta = ({ producto, porcentaje }) => {
    if (!producto) return;
    handleCambiarOferta(producto, true, porcentaje);
  };

  const abrirModalQuitar = (producto) => {
    setProductoQuitar(producto);
    setModalQuitarAbierto(true);
  };

  const cerrarModalQuitar = () => {
    if (quitandoOferta) return;
    setModalQuitarAbierto(false);
    setProductoQuitar(null);
  };

  const confirmarQuitarOferta = async () => {
    if (!productoQuitar) return;
    try {
      setQuitandoOferta(true);
      await handleCambiarOferta(productoQuitar, false);
      cerrarModalQuitar();
    } finally {
      setQuitandoOferta(false);
    }
  };

  const handleCambiarOfertaConConfirmacion = (
    producto,
    activar,
    porcentaje,
  ) => {
    if (activar) {
      handleCambiarOferta(producto, true, porcentaje);
      return;
    }

    abrirModalQuitar(producto);
  };

  return (
    <AdminLayout
      title="Gestor de Ofertas Individuales"
      description="Gestiona descuentos puntuales por producto con una vista simple y accionable"
      usePageScroll={false}
      contentClassName="flex min-h-0 flex-col"
    >
      <div
        className="flex min-h-0 flex-1 flex-col gap-4 sm:gap-5"
        role="main"
        aria-label="Panel de ofertas"
      >
        <section aria-label="Filtros de productos para ofertas">
          <OfertasFilters
            categorias={categorias}
            onOpenAgregarOferta={() => setModalAgregarAbierto(true)}
          />
        </section>

        <div className="flex min-w-0 min-h-0 flex-1 flex-col gap-4">
          <div className="min-w-0">
            <OfertasTable
              onEstablecerDescuento={abrirModalDescuento}
              onCambiarOferta={handleCambiarOfertaConConfirmacion}
              estaEnCampana={estaEnCampana}
            />
          </div>

          <div className="mt-auto min-w-0 shrink-0">
            <Pagination />
          </div>
        </div>
      </div>

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

      <ConfirmQuitarOfertaDialog
        isOpen={modalQuitarAbierto}
        isLoading={quitandoOferta}
        producto={productoQuitar}
        onClose={cerrarModalQuitar}
        onConfirm={confirmarQuitarOferta}
      />

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </AdminLayout>
  );
};

export default AdminOfertas;
