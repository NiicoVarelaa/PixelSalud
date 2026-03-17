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
      contentClassName="space-y-6"
      nested
      headerAction={
        <button
          onClick={abrirModalRegistro}
          className="group w-full sm:w-auto flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-green-600/20 hover:shadow-lg hover:shadow-green-600/25 font-semibold cursor-pointer"
        >
          <span className="h-6 w-6 rounded-md bg-white/15 flex items-center justify-center">
            <Plus size={16} />
          </span>
          Nueva Venta
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

      <div className="space-y-4 lg:flex lg:flex-col lg:min-h-120">
        {/* Tabla de ventas */}
        <VentasTable
          onVerDetalle={handleVerDetalle}
          onEditar={handleEditarVenta}
          onAnular={handleAnular}
          onReactivar={handleReactivar}
          onPrintTicket={(idVenta) => setTicketModal({ show: true, idVenta })}
        />

        {/* Paginación */}
        <div className="lg:mt-auto">
          <Pagination />
        </div>
      </div>

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
