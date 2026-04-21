import { Edit, Printer, RotateCcw, Trash2 } from "lucide-react";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

export const VentaActions = ({
  className,
  iconSize,
  permisos,
  venta,
  onAnular,
  onEditar,
  onPrintTicket,
  onReactivar,
  showTitles = false,
}) => {
  const puedeModificar = !!permisos.modificar_ventasE;

  const titleProps = (text) =>
    showTitles
      ? {
          title: text,
        }
      : {};

  return (
    <>
      <button
        onClick={() => onPrintTicket(venta.idVentaE)}
        className={`${className} bg-orange-100 text-orange-700 hover:bg-orange-200 focus-visible:ring-orange-500 ${baseBtn}`}
        aria-label={`Imprimir ticket ${venta.idVentaE}`}
        {...titleProps("Imprimir")}
      >
        <Printer size={iconSize} aria-hidden="true" />
      </button>

      {venta.estado === "completada" ? (
        <>
          {puedeModificar && (
            <>
              <button
                onClick={() => onEditar(venta)}
                className={`${className} bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500 ${baseBtn}`}
                aria-label={`Editar venta ${venta.idVentaE}`}
                {...titleProps("Editar")}
              >
                <Edit size={iconSize} aria-hidden="true" />
              </button>

              <button
                onClick={() => onAnular(venta.idVentaE)}
                className={`${className} bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500 ${baseBtn}`}
                aria-label={`Anular venta ${venta.idVentaE}`}
                {...titleProps("Anular")}
              >
                <Trash2 size={iconSize} aria-hidden="true" />
              </button>
            </>
          )}
        </>
      ) : (
        <>
          {puedeModificar && (
            <button
              onClick={() => onReactivar(venta.idVentaE)}
              className={`${className} bg-primary-100 text-primary-700 hover:bg-primary-200 focus-visible:ring-primary-500 ${baseBtn}`}
              aria-label={`Reactivar venta ${venta.idVentaE}`}
              {...titleProps("Reactivar")}
            >
              <RotateCcw size={iconSize} aria-hidden="true" />
            </button>
          )}
        </>
      )}
    </>
  );
};
