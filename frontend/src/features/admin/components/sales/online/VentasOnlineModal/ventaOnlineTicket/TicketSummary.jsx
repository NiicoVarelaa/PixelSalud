import { Edit, ShoppingBag } from "lucide-react";
import CustomSelect from "../../../employees/VentasModal/CustomSelect";
import { OPCIONES_METODO_PAGO } from "./ticket.utils";

export const TicketSummary = ({
  ventaForm,
  dispatch,
  isEditing,
  onSubmit,
  formatearMoneda,
}) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4 sm:p-5 shrink-0 z-10 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <div className="w-full sm:w-52">
            <CustomSelect
              id="metodo-pago-online"
              label="Metodo de Pago"
              value={ventaForm.metodoPago}
              menuPlacement="top"
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "metodoPago",
                  value,
                })
              }
              options={OPCIONES_METODO_PAGO}
            />
          </div>
        </div>

        <div className="text-left sm:text-right bg-green-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-green-100 flex items-center sm:block justify-between">
          <span className="block text-green-800 sm:text-gray-500 text-xs sm:text-[11px] font-black uppercase tracking-wider sm:mb-0.5">
            Total Final
          </span>
          <span className="text-2xl sm:text-3xl font-black text-green-700 leading-none">
            {formatearMoneda(ventaForm.totalPago)}
          </span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={ventaForm.productos.length === 0}
        className={`
          w-full py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all outline-none flex items-center justify-center gap-2 cursor-pointer
          ${
            ventaForm.productos.length === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] shadow-lg shadow-green-600/20 focus-visible:ring-4 focus-visible:ring-green-500/30"
          }
        `}
        aria-disabled={ventaForm.productos.length === 0}
      >
        {isEditing ? <Edit size={20} /> : <ShoppingBag size={20} />}
        {isEditing ? "Guardar Cambios" : "Confirmar Venta"}
      </button>
    </div>
  );
};
