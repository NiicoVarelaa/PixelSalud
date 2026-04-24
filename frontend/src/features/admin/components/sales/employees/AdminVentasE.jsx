import { useEffect, useRef, useState } from "react";
import TicketVenta from "@features/admin/components/sales/shared/TicketVenta";
import {
  ConfirmAnularVentaDialog,
  ConfirmReactivarVentaDialog,
  VentasFilters,
  VentasTable,
  Pagination,
} from "./components";
import { VentasModal } from "./VentasModal";
import { useVentasData } from "./hooks/useVentasData";
import { useVentaForm } from "./hooks/useVentaForm";

const AdminVentasE = ({ openRequestToken = 0 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnulandoVenta, setIsAnulandoVenta] = useState(false);
  const [ventaPendienteAnular, setVentaPendienteAnular] = useState(null);
  const [isReactivandoVenta, setIsReactivandoVenta] = useState(false);
  const [ventaPendienteReactivar, setVentaPendienteReactivar] = useState(null);

  const lastOpenRequestRef = useRef(openRequestToken);
  const [ticketModal, setTicketModal] = useState({
    show: false,
    idVenta: null,
  });

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

  useEffect(() => {
    if (openRequestToken !== lastOpenRequestRef.current) {
      resetForm();
      setIsModalOpen(true);
      lastOpenRequestRef.current = openRequestToken;
    }
  }, [openRequestToken, resetForm]);

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

  const handleRequestAnular = (idVentaE) => {
    setVentaPendienteAnular(idVentaE);
  };

  const handleCloseConfirmAnular = () => {
    if (isAnulandoVenta) {
      return;
    }
    setVentaPendienteAnular(null);
  };

  const handleConfirmAnular = async () => {
    if (!ventaPendienteAnular) {
      return;
    }

    setIsAnulandoVenta(true);
    const ok = await handleAnular(ventaPendienteAnular);
    setIsAnulandoVenta(false);

    if (ok) {
      setVentaPendienteAnular(null);
    }
  };

  const handleRequestReactivar = (idVentaE) => {
    setVentaPendienteReactivar(idVentaE);
  };

  const handleCloseConfirmReactivar = () => {
    if (isReactivandoVenta) {
      return;
    }
    setVentaPendienteReactivar(null);
  };

  const handleConfirmReactivar = async () => {
    if (!ventaPendienteReactivar) {
      return;
    }

    setIsReactivandoVenta(true);
    const ok = await handleReactivar(ventaPendienteReactivar);
    setIsReactivandoVenta(false);

    if (ok !== false) {
      setVentaPendienteReactivar(null);
    }
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <VentasFilters />

        <div className="flex min-w-0 flex-col gap-4">
          <div className="min-w-0">
            <VentasTable
              onVerDetalle={handleVerDetalle}
              onEditar={handleEditarVenta}
              onAnular={handleRequestAnular}
              onReactivar={handleRequestReactivar}
              onPrintTicket={(idVenta) =>
                setTicketModal({ show: true, idVenta })
              }
            />
          </div>

          <div className="mt-auto min-w-0 shrink-0">
            <Pagination />
          </div>
        </div>
      </div>

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

      <ConfirmAnularVentaDialog
        isOpen={Boolean(ventaPendienteAnular)}
        isLoading={isAnulandoVenta}
        onClose={handleCloseConfirmAnular}
        onConfirm={handleConfirmAnular}
      />

      <ConfirmReactivarVentaDialog
        isOpen={Boolean(ventaPendienteReactivar)}
        isLoading={isReactivandoVenta}
        onClose={handleCloseConfirmReactivar}
        onConfirm={handleConfirmReactivar}
      />

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