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
  ConfirmOfertaDialog,
  OfertaDetail,
  OfertasStatsCards,
} from "./components";

const AdminOfertas = () => {
  const { productos, setItemsPorPagina } = useOfertasStore();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    producto: null,
    type: "danger",
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
  });

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

  const confirmarDescuento = (porcentaje, fechas) => {
    if (productoSeleccionado) {
      handleCambiarOferta(productoSeleccionado, true, porcentaje, fechas);
    }
  };

  const confirmarAgregarOferta = ({ producto, porcentaje, fechas }) => {
    if (!producto) return;
    handleCambiarOferta(producto, true, porcentaje, fechas);
  };

  const cerrarConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      producto: null,
      type: "danger",
      title: "",
      message: "",
      confirmText: "",
      onConfirm: null,
    });
  };

  const abrirDetalle = (producto) => {
    setProductoDetalle(producto);
  };

  const cerrarDetalle = () => {
    setProductoDetalle(null);
  };

  const handleCambiarOfertaConConfirmacion = (
    producto,
    activar,
    porcentaje,
    fechas,
  ) => {
    if (activar) {
      setConfirmDialog({
        isOpen: true,
        producto,
        type: "success",
        title: `¿Aplicar ${porcentaje}% de descuento?`,
        message: `Se aplicará un ${porcentaje}% OFF a ${producto.nombreProducto}${fechas ? ` (${new Date(fechas.fechaInicio).toLocaleDateString("es-AR")} - ${new Date(fechas.fechaFin).toLocaleDateString("es-AR")})` : ""}`,
        confirmText: "Sí, aplicar",
        onConfirm: () => {
          handleCambiarOferta(producto, true, porcentaje, fechas);
          cerrarConfirmDialog();
        },
      });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      producto,
      type: "danger",
      title: "¿Quitar oferta?",
      message: `Se eliminará el descuento de ${producto.nombreProducto}`,
      confirmText: "Sí, quitar",
      onConfirm: async () => {
        await handleCambiarOferta(producto, false);
        cerrarConfirmDialog();
      },
    });
  };

  return (
    <AdminLayout
      title="Gestor de Ofertas Individuales"
      description="Gestiona descuentos puntuales por producto con una vista simple y accionable"
      usePageScroll={false}
      contentClassName="flex min-h-0 flex-col"
    >
      <OfertasStatsCards productos={productos} />

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
              onVerDetalle={abrirDetalle}
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

      <ConfirmOfertaDialog
        isOpen={confirmDialog.isOpen}
        producto={confirmDialog.producto}
        onClose={cerrarConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        type={confirmDialog.type}
      />

      <OfertaDetail
        producto={productoDetalle}
        onClose={cerrarDetalle}
      />

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </AdminLayout>
  );
};

export default AdminOfertas;
