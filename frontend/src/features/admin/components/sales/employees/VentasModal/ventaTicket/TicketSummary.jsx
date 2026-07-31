import { Edit, ShoppingBag } from "lucide-react";
import CustomSelect from "../CustomSelect";
import { OPCIONES_METODO_PAGO } from "./ticket.utils";

export const TicketSummary = ({
  dispatch,
  formatearMoneda,
  isEditing,
  onSubmit,
  ventaForm,
}) => {
  return (
    <div className="shrink-0 border-t border-gray-200 bg-white p-3 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] sm:p-5">
      <div className="mb-3 flex flex-row items-center justify-between gap-3 sm:mb-4">
        <div className="w-[140px] sm:w-52">
          <CustomSelect
            id="metodo-pago"
            label="Método"
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

        <div className="flex flex-col items-end rounded-lg bg-green-50/50 px-3 py-1.5 border border-green-100 sm:px-4 sm:py-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-green-800 sm:text-xs">
            Total
          </span>
          <span className="text-xl font-black leading-none text-green-700 sm:text-3xl">
            {formatearMoneda(ventaForm.totalPago)}
          </span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={ventaForm.productos.length === 0}
        className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all outline-none sm:py-4 sm:text-lg ${
          ventaForm.productos.length === 0
            ? "border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-green-600 text-white shadow-md shadow-green-600/20 hover:bg-green-700 active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-green-500/30"
        }`}
        aria-disabled={ventaForm.productos.length === 0}
      >
        {isEditing ? <Edit size={18} /> : <ShoppingBag size={18} />}
        {isEditing ? "Guardar Cambios" : "Confirmar Venta"}
      </button>
    </div>
  );
};