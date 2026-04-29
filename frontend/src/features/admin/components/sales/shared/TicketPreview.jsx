import React from "react";

const TicketPreview = React.forwardRef(({ ticket }, ref) => {
  if (!ticket) return null;
  return (
    <div
      ref={ref}
      className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 font-mono text-gray-900 selection:bg-gray-200"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold tracking-wider mb-1 text-emerald-600">
          PIXEL SALUD
        </h3>
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          Comprobante
        </p>
      </div>
      <div className="border-y border-dashed border-gray-300 py-4 mb-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Ticket N°:</span>
          <span className="font-bold">
            {String(ticket.numero).padStart(6, "0")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Fecha/Hora:</span>
          <span className="font-medium">
            {ticket.fecha} - {ticket.hora}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Vendedor:</span>
          <span className="font-medium">{ticket.vendedor}</span>
        </div>
        {ticket.vendedorDni && (
          <div className="flex justify-between">
            <span className="text-gray-500">DNI vendedor:</span>
            <span className="font-medium">{ticket.vendedorDni}</span>
          </div>
        )}
        {ticket.cliente && (
          <div className="flex justify-between">
            <span className="text-gray-500">Cliente:</span>
            <span
              className="font-medium text-right max-w-[150px] truncate"
              title={ticket.cliente}
            >
              {ticket.cliente}
            </span>
          </div>
        )}
        {ticket.clienteInfo?.dni && (
          <div className="flex justify-between">
            <span className="text-gray-500">DNI cliente:</span>
            <span className="font-medium">{ticket.clienteInfo.dni}</span>
          </div>
        )}
        {ticket.clienteInfo?.email && (
          <div className="flex justify-between gap-2">
            <span className="text-gray-500">Email:</span>
            <span
              className="font-medium text-right max-w-[150px] truncate"
              title={ticket.clienteInfo.email}
            >
              {ticket.clienteInfo.email}
            </span>
          </div>
        )}
        {ticket.clienteInfo?.telefono && (
          <div className="flex justify-between">
            <span className="text-gray-500">Celular:</span>
            <span className="font-medium">{ticket.clienteInfo.telefono}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Pago:</span>
          <span className="font-medium">{ticket.metodoPago}</span>
        </div>
        {ticket.entrega?.tipoEntrega && (
          <div className="flex justify-between">
            <span className="text-gray-500">Entrega:</span>
            <span className="font-medium">{ticket.entrega.tipoEntrega}</span>
          </div>
        )}
        {ticket.entrega?.sucursalNombre && (
          <div className="flex justify-between gap-2">
            <span className="text-gray-500">Sucursal:</span>
            <span
              className="font-medium text-right max-w-[150px] truncate"
              title={ticket.entrega.sucursalNombre}
            >
              {ticket.entrega.sucursalNombre}
            </span>
          </div>
        )}
        {ticket.entrega?.sucursalDireccion && (
          <div className="flex justify-between gap-2">
            <span className="text-gray-500">Dirección retiro:</span>
            <span
              className="font-medium text-right max-w-[150px] truncate"
              title={ticket.entrega.sucursalDireccion}
            >
              {ticket.entrega.sucursalDireccion}
            </span>
          </div>
        )}
      </div>
      <div className="mb-4">
        <div className="text-xs font-bold text-gray-500 border-b border-gray-300 pb-2 mb-3 uppercase tracking-wider">
          Detalle de compra
        </div>
        <div className="space-y-4">
          {ticket.productos.map((producto, index) => (
            <div key={index} className="flex flex-col text-sm">
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold leading-tight">
                  {producto.cantidad}x{" "}
                  <span className="font-medium">{producto.descripcion}</span>
                </span>
                <span className="font-bold whitespace-nowrap">
                  $
                  {producto.subtotal.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                $
                {producto.precioUnitario.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}{" "}
                c/u
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-dashed border-gray-300 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal:</span>
          <span className="font-medium">
            $
            {ticket.subtotal.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
        {ticket.descuento > 0 && (
          <div className="flex justify-between text-sm text-emerald-600 font-medium">
            <span>Descuento:</span>
            <span>
              -$
              {ticket.descuento.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between items-end pt-2">
          <span className="text-lg font-bold text-gray-900">TOTAL:</span>
          <span className="text-2xl font-black tracking-tight text-gray-900">
            $
            {ticket.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      <div className="text-center mt-8 text-xs text-gray-400 space-y-1">
        <p>¡Gracias por su compra!</p>
        <p>www.pixelsalud.com</p>
      </div>
    </div>
  );
});

export default TicketPreview;
