import { useState } from "react";
import { Plus } from "lucide-react";
import { TicketVenta } from "@components/shared";
import { AdminLayout } from "@features/admin/components/shared";
import { VentasFilters, VentasTable, Pagination } from "./components";
import { VentasModal } from "./VentasModal";
import { useVentasData } from "./hooks/useVentasData";
import { useVentaForm } from "./hooks/useVentaForm";

const AdminVentasE = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketModal, setTicketModal] = useState({
    show: false,
    idVenta: null,
  });

  // Custom hooks para lógica de negocio
  const { obtenerVentas, handleAnular, handleReactivar, handleVerDetalle } =
    useVentasData();

  const {
    ventaForm,
    dispatch,
    isEditing,
    editingId,
    nombreVendedorOriginal,
    resetForm,
    loadVentaForEdit,
    submitVenta,
    user,
  } = useVentaForm(obtenerVentas);

  const abrirModalRegistro = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditarVenta = async (venta) => {
    const success = await loadVentaForEdit(venta);
    if (success) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <AdminLayout
      title="Ventas Empleados"
      description="Gestiona y registra las ventas del local"
      headerAction={
        <button
          onClick={abrirModalRegistro}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg transition shadow-md font-medium cursor-pointer"
        >
          <Plus size={20} /> Nueva Venta
        </button>
      }
    >
      {/* Modal de registro/edición */}
      <VentasModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ventaForm={ventaForm}
        dispatch={dispatch}
        isEditing={isEditing}
        editingId={editingId}
        nombreVendedorOriginal={nombreVendedorOriginal}
        user={user}
        onSubmit={submitVenta}
      />

      {/* Filtros */}
      <VentasFilters />

      {/* Tabla de ventas */}
      <VentasTable
        onVerDetalle={handleVerDetalle}
        onEditar={handleEditarVenta}
        onAnular={handleAnular}
        onReactivar={handleReactivar}
        onPrintTicket={(idVenta) => setTicketModal({ show: true, idVenta })}
      />

      {/* Paginación */}
      <Pagination />

      {/* Modal de Ticket para imprimir */}
      <TicketVenta
        idVenta={ticketModal.idVenta}
        tipo="empleado"
        show={ticketModal.show}
        onClose={() => setTicketModal({ show: false, idVenta: null })}
      />
    </AdminLayout>
  );
};

export default AdminVentasE;
