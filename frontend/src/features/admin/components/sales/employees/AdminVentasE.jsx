import { useState } from "react";
import { Plus } from "lucide-react";
import TicketVenta from "@features/admin/components/sales/shared/TicketVenta";
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
    <>
      <div className="mb-4 flex shrink-0 flex-col gap-4 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">Ventas Empleados</h2>
          <p className="text-sm text-gray-600">
            Gestiona y registra las ventas del local
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={abrirModalRegistro}
            className="group flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 sm:w-auto"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15">
              <Plus size={16} />
            </span>
            Nueva Venta
          </button>
        </div>
      </div>

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

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="min-h-0 flex-1">
          {/* Tabla de ventas */}
          <VentasTable
            onVerDetalle={handleVerDetalle}
            onEditar={handleEditarVenta}
            onAnular={handleAnular}
            onReactivar={handleReactivar}
            onPrintTicket={(idVenta) => setTicketModal({ show: true, idVenta })}
          />
        </div>

        {/* Paginación */}
        <div className="mt-auto">
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
    </>
  );
};

export default AdminVentasE;
