import {
  ChevronDown,
  ChevronUp,
  Edit,
  Minus,
  Plus,
  Trash2,
  UserCircle,
  ReceiptText,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import Default from "@assets/default.webp";
import apiClient from "@utils/apiClient";
import CustomSelect from "./CustomSelect";

export const VentaTicket = ({
  ventaForm,
  dispatch,
  isEditing,
  nombreVendedorOriginal,
  user,
  onSubmit,
  mobileCollapsed = false,
  onToggleMobileCollapsed,
}) => {
  const [imagenesPorProducto, setImagenesPorProducto] = useState({});

  const opcionesMetodoPago = [
    { value: "Efectivo", label: "Efectivo" },
    { value: "Tarjeta", label: "Tarjeta" },
    { value: "Transferencia", label: "Transferencia" },
  ];

  useEffect(() => {
    const cargarImagenesFaltantes = async () => {
      const idsSinImagen = ventaForm.productos
        .map((item) => item.idProducto)
        .filter(
          (idProducto) =>
            idProducto &&
            !imagenesPorProducto[idProducto] &&
            !ventaForm.productos.find(
              (item) =>
                item.idProducto === idProducto &&
                (item.imagenProducto ||
                  item.img ||
                  item.urlImagen ||
                  item.imagen ||
                  item.imagenPrincipal),
            ),
        );

      if (idsSinImagen.length === 0) return;

      const resultados = await Promise.all(
        idsSinImagen.map(async (idProducto) => {
          try {
            const res = await apiClient.get(
              `/productos/${idProducto}/imagenes/principal`,
            );
            return [idProducto, res.data?.urlImagen || Default];
          } catch {
            return [idProducto, Default];
          }
        }),
      );

      setImagenesPorProducto((prev) => {
        const next = { ...prev };
        resultados.forEach(([idProducto, url]) => {
          next[idProducto] = url;
        });
        return next;
      });
    };

    cargarImagenesFaltantes();
  }, [imagenesPorProducto, ventaForm.productos]);

  const getProductImage = (item) => {
    return (
      item.imagenProducto ||
      item.img ||
      item.urlImagen ||
      item.imagen ||
      item.imagenPrincipal ||
      imagenesPorProducto[item.idProducto] ||
      Default
    );
  };

  const formatearMoneda = (val) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(Number(val) || 0);

  return (
    <div className="w-full lg:w-[55%] shrink-0 lg:min-h-0 lg:flex lg:flex-col bg-gray-50/30">
      <button
        type="button"
        className="lg:hidden w-full sticky bottom-0 z-20 px-4 py-3 bg-white border-t border-b border-gray-200 flex items-center justify-between cursor-pointer shadow-[0_-6px_18px_-14px_rgba(0,0,0,0.35)]"
        onClick={onToggleMobileCollapsed}
        aria-expanded={!mobileCollapsed}
        aria-label="Mostrar u ocultar resumen del ticket"
      >
        <div className="flex items-center gap-2">
          <ReceiptText size={18} className="text-gray-500" aria-hidden="true" />
          <span className="text-sm font-bold text-gray-800">
            Resumen del Ticket
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-black">
            {ventaForm.productos.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-green-700">
            {formatearMoneda(ventaForm.totalPago)}
          </span>
          {mobileCollapsed ? (
            <ChevronDown
              size={18}
              className="text-gray-500"
              aria-hidden="true"
            />
          ) : (
            <ChevronUp size={18} className="text-gray-500" aria-hidden="true" />
          )}
        </div>
      </button>

      <div
        className={`${mobileCollapsed ? "hidden lg:flex" : "flex"} min-h-0 flex-1 flex-col ${mobileCollapsed ? "" : "max-h-[62vh] lg:max-h-none"}`}
      >
        <div className="hidden lg:flex px-4 sm:px-6 py-4 flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white border-b border-gray-200 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ReceiptText
              size={20}
              className="text-gray-400"
              aria-hidden="true"
            />
            Resumen del Ticket
            <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-md text-xs font-black">
              {ventaForm.productos.length}
            </span>
          </h3>
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 w-fit">
            <UserCircle
              size={16}
              className="text-gray-500"
              aria-hidden="true"
            />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              {isEditing && nombreVendedorOriginal
                ? `Editando: ${nombreVendedorOriginal}`
                : user.nombre || `Admin (ID: ${user.id})`}
            </span>
          </div>
        </div>

        <div className="overflow-y-auto p-2 sm:p-4 max-h-[28vh] lg:max-h-none lg:flex-1">
          {ventaForm.productos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <ReceiptText
                size={40}
                className="text-gray-300 mb-3"
                aria-hidden="true"
              />
              <p className="text-gray-500 font-semibold text-base">
                El ticket está vacío
              </p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">
                Agrega productos desde el buscador de la izquierda.
              </p>
            </div>
          ) : (
            <ul className="space-y-2" role="list">
              {ventaForm.productos.map((item, index) => (
                <li
                  key={index}
                  className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-gray-300"
                >
                  <div className="flex-1 min-w-0 pr-2 flex items-start gap-3">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                      <img
                        src={getProductImage(item)}
                        alt={item.nombreProducto}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = Default;
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-snug truncate">
                        {item.nombreProducto}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-gray-500">
                          {formatearMoneda(item.precioUnitario)} c/u
                        </span>
                        {item.recetaFisica && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-orange-100 text-orange-800 uppercase tracking-wider">
                            Rx
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-100 sm:border-0">
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5">
                      <button
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_PRODUCT",
                            index,
                            field: "cantidad",
                            value: Math.max(1, Number(item.cantidad || 1) - 1),
                          })
                        }
                        className="h-8 w-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all focus-visible:ring-2 outline-none cursor-pointer"
                        aria-label={`Reducir cantidad de ${item.nombreProducto}`}
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-gray-900">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_PRODUCT",
                            index,
                            field: "cantidad",
                            value: Number(item.cantidad || 1) + 1,
                          })
                        }
                        className="h-8 w-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all focus-visible:ring-2 outline-none cursor-pointer"
                        aria-label={`Aumentar cantidad de ${item.nombreProducto}`}
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>

                    <div className="text-right min-w-20">
                      <span className="block sm:hidden text-[10px] font-bold text-gray-400 uppercase">
                        Subtotal
                      </span>
                      <span className="font-black text-gray-900 text-sm sm:text-base">
                        {formatearMoneda(item.cantidad * item.precioUnitario)}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        dispatch({ type: "REMOVE_PRODUCT", index })
                      }
                      className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-red-500 outline-none cursor-pointer"
                      aria-label={`Eliminar ${item.nombreProducto} del ticket`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border-t border-gray-200 p-4 sm:p-5 shrink-0 z-10 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-4">
            <div className="w-full sm:w-auto">
              <div className="w-full sm:w-52">
                <CustomSelect
                  id="metodo-pago"
                  label="Método de Pago"
                  value={ventaForm.metodoPago}
                  menuPlacement="top"
                  onChange={(value) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "metodoPago",
                      value,
                    })
                  }
                  options={opcionesMetodoPago}
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
      </div>
    </div>
  );
};
