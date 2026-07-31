import { useState, useEffect } from "react";
import apiClient from "@utils/apiClient";
import { Receipt, X, Loader2, Package } from "lucide-react";
import { formatMoneda } from "@features/employee/utils/ventas.utils";

const DetalleModal = ({ isOpen, onClose, idVenta }) => {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !idVenta) return;
    setLoading(true);
    setDetalle(null);
    apiClient.get(`/ventasEmpleados/detalle/${idVenta}`)
      .then((r) => setDetalle(r.data))
      .catch(() => setDetalle([]))
      .finally(() => setLoading(false));
  }, [isOpen, idVenta]);

  if (!isOpen) return null;

  const totalCalculado = detalle ? detalle.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/45 backdrop-blur-sm cursor-pointer" onClick={onClose} aria-label="Cerrar" />
      <div className="relative w-full max-w-2xl rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <Receipt size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Ticket #{idVenta}</h3>
              <p className="text-xs text-gray-500">Detalle de productos</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded-lg cursor-pointer" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={28} className="text-green-600 animate-spin mb-3" />
              <p className="text-sm text-gray-500">Cargando detalle...</p>
            </div>
          ) : !detalle || detalle.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 mb-3">
                <Package size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Sin productos</p>
              <p className="text-xs text-gray-400 mt-1">No hay productos en esta venta</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-center">Cant.</th>
                    <th className="px-4 py-3 text-right">P. Unit</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {detalle.map((prod, i) => {
                    const subtotal = prod.cantidad * prod.precioUnitario;
                    return (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate">{prod.nombreProducto}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{prod.cantidad}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{formatMoneda(prod.precioUnitario)}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-800">{formatMoneda(subtotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-green-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right font-bold text-gray-600 uppercase text-xs">Total Final:</td>
                    <td className="px-4 py-3 text-right font-extrabold text-green-700 text-lg">{formatMoneda(totalCalculado)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors cursor-pointer">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default DetalleModal;
