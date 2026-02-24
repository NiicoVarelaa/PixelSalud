import { useState, useEffect, useRef } from "react";
import { X, Printer, Download } from "lucide-react";
import apiClient from "@utils/apiClient";

const TicketVenta = ({ idVenta, tipo, onClose, show }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ticketRef = useRef();

  useEffect(() => {
    if (show && idVenta) {
      cargarTicket();
    }
  }, [show, idVenta, tipo]);

  const cargarTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        tipo === "empleado"
          ? `/ticket/empleado/${idVenta}`
          : `/ticket/online/${idVenta}`;

      const response = await apiClient.get(endpoint);
      setTicket(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar el ticket");
      console.error("Error cargando ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    // Crear una ventana de impresión
    const printWindow = window.open("", "", "width=800,height=600");
    const ticketContent = ticketRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket ${ticket?.numero || idVenta}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 5mm;
            }
            body {
              font-family: 'Courier New', monospace;
              margin: 0;
              padding: 10px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${ticketContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Printer className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              Vista Previa del Ticket
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Cargando ticket...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && ticket && (
            <>
              {/* Ticket Preview */}
              <div className="bg-white rounded-lg shadow-lg mb-6">
                <div ref={ticketRef} className="p-8 font-mono">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold tracking-wider mb-2">
                      PIXEL SALUD
                    </h1>
                    <p className="text-sm text-gray-600">
                      Comprobante de Venta
                    </p>
                  </div>

                  <div className="border-t-2 border-b-2 border-dashed border-gray-400 py-4 mb-4">
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Ticket N°:</span>
                      </div>
                      <div className="text-right">
                        {String(ticket.numero).padStart(6, "0")}
                      </div>

                      <div>
                        <span className="font-semibold">Fecha:</span>
                      </div>
                      <div className="text-right">{ticket.fecha}</div>

                      <div>
                        <span className="font-semibold">Hora:</span>
                      </div>
                      <div className="text-right">{ticket.hora}</div>

                      <div>
                        <span className="font-semibold">Vendedor:</span>
                      </div>
                      <div className="text-right">{ticket.vendedor}</div>

                      {ticket.cliente && (
                        <>
                          <div>
                            <span className="font-semibold">Cliente:</span>
                          </div>
                          <div className="text-right">{ticket.cliente}</div>
                        </>
                      )}

                      <div>
                        <span className="font-semibold">Método de Pago:</span>
                      </div>
                      <div className="text-right">{ticket.metodoPago}</div>
                    </div>
                  </div>

                  {/* Productos */}
                  <div className="mb-4">
                    <div className="grid grid-cols-12 gap-2 text-sm font-semibold border-b-2 border-gray-300 pb-2 mb-2">
                      <div className="col-span-2">Cant</div>
                      <div className="col-span-6">Descripción</div>
                      <div className="col-span-4 text-right">Total</div>
                    </div>

                    {ticket.productos.map((producto, index) => (
                      <div key={index} className="mb-3">
                        <div className="grid grid-cols-12 gap-2 text-sm">
                          <div className="col-span-2 font-semibold">
                            {producto.cantidad}
                          </div>
                          <div className="col-span-6">
                            {producto.descripcion}
                          </div>
                          <div className="col-span-4 text-right font-semibold">
                            ${" "}
                            {producto.subtotal.toLocaleString("es-AR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 ml-2">
                          ${" "}
                          {producto.precioUnitario.toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          c/u
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-dashed border-gray-400 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Subtotal:</span>
                      <span>
                        ${" "}
                        {ticket.subtotal.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {ticket.descuento > 0 && (
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>Descuento:</span>
                        <span>
                          - ${" "}
                          {ticket.descuento.toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-2xl font-bold mt-2">
                      <span>TOTAL:</span>
                      <span>
                        ${" "}
                        {ticket.total.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center mt-6 text-xs text-gray-500">
                    <p>¡Gracias por su compra!</p>
                    <p className="mt-1">www.pixelsalud.com</p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
                >
                  <X className="w-5 h-5" />
                  Cerrar
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium"
                >
                  <Printer className="w-5 h-5" />
                  Imprimir
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketVenta;
