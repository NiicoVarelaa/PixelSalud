import { useRef } from "react";
import { X, Printer, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TicketPreview from "./TicketPreview";
import { useTicket } from "@hooks/useTicket";
import { useModalLock } from "@hooks/useModalLock";

const TicketVenta = ({ idVenta, tipo, onClose, show }) => {
  const ticketRef = useRef();
  const { ticket, loading, error } = useTicket(idVenta, tipo, show);
  useModalLock(show);

  const handlePrint = () => {
    if (!ticketRef.current) return;
    const printWindow = window.open("", "", "width=800,height=600");
    const ticketContent = ticketRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <title>Ticket ${ticket?.numero || idVenta}</title>
          <style>
            @page { size: 80mm auto; margin: 5mm; }
            body {
              font-family: 'Courier New', Courier, monospace;
              margin: 0;
              padding: 10px;
              color: #000;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          </style>
        </head>
        <body>${ticketContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-h-[95dvh] sm:max-h-[90vh] sm:max-w-2xl bg-gray-100 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Printer
                    className="w-5 h-5 text-gray-700"
                    aria-hidden="true"
                  />
                </div>
                <h2
                  id="modal-title"
                  className="text-lg sm:text-xl font-bold text-gray-900"
                >
                  Vista Previa del Ticket
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar ventana de ticket"
                autoFocus
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
                  <p className="text-gray-500 font-medium">
                    Generando comprobante...
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">{error}</p>
                </div>
              )}

              {!loading && !error && ticket && (
                <div className="flex justify-center">
                  <TicketPreview ticket={ticket} ref={ticketRef} />
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 bg-white z-10 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl transition-all font-medium flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 active:scale-[0.98]"
              >
                Cancelar
              </button>
              <button
                onClick={handlePrint}
                disabled={loading || error || !ticket}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 active:scale-[0.98]"
              >
                <Printer className="w-5 h-5" />
                Imprimir Ticket
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TicketVenta;
