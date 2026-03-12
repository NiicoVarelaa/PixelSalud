import { Trash2, UserCircle } from "lucide-react";

export const VentaTicket = ({
  ventaForm,
  dispatch,
  isEditing,
  nombreVendedorOriginal,
  user,
  onSubmit,
}) => {
  const formatearMoneda = (val) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(Number(val) || 0);

  return (
    <div className="w-full lg:w-1/2 p-6 flex flex-col bg-white overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
          🧾 Ticket de Venta{" "}
          <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs">
            {ventaForm.productos.length} items
          </span>
        </h3>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border">
          <UserCircle size={16} className="text-gray-500" />
          <span className="text-xs font-bold text-gray-600 uppercase">
            {isEditing && nombreVendedorOriginal
              ? `Editando a: ${nombreVendedorOriginal}`
              : user.nombre || `Admin (ID: ${user.id})`}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg mb-4">
        <table className="w-full text-left">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                Prod.
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase text-center">
                Cant.
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase text-right">
                Subtotal
              </th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ventaForm.productos.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 group">
                <td className="p-3 text-sm">
                  <div className="font-medium text-gray-800">
                    {item.nombreProducto}
                  </div>
                  {item.recetaFisica && (
                    <span className="inline-block bg-orange-100 text-orange-800 text-[10px] px-1.5 rounded font-bold mt-1">
                      Rx
                    </span>
                  )}
                </td>
                <td className="p-3 text-center text-sm">{item.cantidad}</td>
                <td className="p-3 text-right text-sm font-bold text-gray-700">
                  {formatearMoneda(item.cantidad * item.precioUnitario)}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => dispatch({ type: "REMOVE_PRODUCT", index })}
                    className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {ventaForm.productos.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-8 text-center text-gray-400 italic"
                >
                  El ticket está vacío.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Método de Pago
            </label>
            <select
              value={ventaForm.metodoPago}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "metodoPago",
                  value: e.target.value,
                })
              }
              className="p-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-primary-500 outline-none text-sm w-40"
            >
              <option value="Efectivo">💵 Efectivo</option>
              <option value="Tarjeta">💳 Tarjeta</option>
              <option value="Transferencia">🏦 Transferencia</option>
            </select>
          </div>
          <div className="text-right">
            <span className="block text-gray-500 text-xs uppercase">
              Total Final
            </span>
            <span className="text-3xl font-extrabold text-primary-700">
              {formatearMoneda(ventaForm.totalPago)}
            </span>
          </div>
        </div>
        <button
          onClick={onSubmit}
          disabled={ventaForm.productos.length === 0}
          className={`w-full py-3 rounded-lg font-bold text-lg shadow-md transition ${ventaForm.productos.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary-600 text-white hover:bg-primary-700 active:scale-95"}`}
        >
          {isEditing ? "Guardar Cambios" : "✅ Confirmar Venta"}
        </button>
      </div>
    </div>
  );
};
