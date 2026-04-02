import OrderCard from "@features/customer/components/orders/OrderCard";

const OrdersList = ({ ventas, expandedOrder, onToggleOrder, onOpenTicket }) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto pr-1">
      <div className="flex flex-col gap-3 sm:gap-4">
        {ventas.map((venta, index) => (
          <OrderCard
            key={venta.idVentaO}
            venta={venta}
            index={index}
            isExpanded={expandedOrder === venta.idVentaO}
            onToggle={() => onToggleOrder(venta.idVentaO)}
            onOpenTicket={onOpenTicket}
          />
        ))}
      </div>
    </div>
  );
};

export default OrdersList;
