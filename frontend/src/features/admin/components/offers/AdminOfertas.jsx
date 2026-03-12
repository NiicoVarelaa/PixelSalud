import { useMemo, useState } from "react";
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
} from "./components";

const AdminOfertas = () => {
  const { productos } = useOfertasStore();

  // Estado para el modal de descuento
  const [modalAbierto, setModalAbierto] = useState(false);
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

  return (
    <AdminLayout
      title="Gestión de Ofertas Individuales"
      description="Activa o desactiva ofertas en productos individuales (10%, 15%, 20%)"
    >
      {/* Filtros */}
      <OfertasFilters categorias={categorias} />

      {/* Tabla de productos */}
      <OfertasTable
        onEstablecerDescuento={abrirModalDescuento}
        onCambiarOferta={handleCambiarOferta}
        estaEnCampana={estaEnCampana}
      />

      {/* Paginación */}
      <Pagination />

      {/* Modal de descuento (reemplaza SweetAlert2) */}
      <ModalDescuento
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setProductoSeleccionado(null);
        }}
        producto={productoSeleccionado}
        onConfirm={confirmarDescuento}
      />

      {/* Toast global para notificaciones */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </AdminLayout>
  );
};

export default AdminOfertas;
