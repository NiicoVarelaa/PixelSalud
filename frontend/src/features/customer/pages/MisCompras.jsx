import { motion } from "framer-motion";
import TicketVenta from "@features/admin/components/sales/shared/TicketVenta";
import Pagination from "@features/admin/components/products/components/Pagination";
import { usePagination } from "@features/admin/components/products/hooks/usePagination";
import {
  MisComprasEmptyState,
  MisComprasHeader,
  MisComprasLoading,
  OrdersList,
} from "@features/customer/components/orders";
import useMisCompras from "@features/customer/hooks/useMisCompras";

const MisCompras = () => {
  const {
    ventasAgrupadas,
    cargando,
    expandedOrder,
    ticketModal,
    toggleOrder,
    openTicket,
    closeTicket,
  } = useMisCompras();

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(
    ventasAgrupadas,
    7,
  );

  if (cargando) {
    return <MisComprasLoading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="pt-4 mx-auto flex min-h-full max-w-4xl flex-col pb-4"
    >
      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.22 }}
      >
        <MisComprasHeader />
      </motion.div>

      {ventasAgrupadas.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.06 }}
          className="flex-1"
        >
          <MisComprasEmptyState />
        </motion.div>
      ) : (
        <>
          <OrdersList
            ventas={paginatedItems}
            expandedOrder={expandedOrder}
            onToggleOrder={toggleOrder}
            onOpenTicket={openTicket}
          />

          <div className="mt-4 shrink-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        </>
      )}

      <TicketVenta
        idVenta={ticketModal.idVenta}
        tipo="online"
        show={ticketModal.show}
        onClose={closeTicket}
      />
    </motion.div>
  );
};

export default MisCompras;
