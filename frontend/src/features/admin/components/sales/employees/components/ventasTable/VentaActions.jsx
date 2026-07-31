import { Edit, Power, Printer, RotateCcw } from "lucide-react";

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
  tone = "soft",
}) => {
  const puedeModificar = !!permisos.modificar_ventasE;

  const palette =
    tone === "strong"
      ? {
          print:
            "bg-orange-200 text-orange-800 hover:bg-orange-300 focus-visible:ring-orange-600",
          edit: "bg-yellow-200 text-yellow-800 hover:bg-yellow-300 focus-visible:ring-yellow-600",
          remove:
            "bg-red-200 text-red-800 hover:bg-red-300 focus-visible:ring-red-600",
          reactivate:
            "bg-primary-200 text-primary-800 hover:bg-primary-300 focus-visible:ring-primary-600",
        }
      : {
          print:
            "bg-orange-100 text-orange-700 hover:bg-orange-200 focus-visible:ring-orange-500",
          edit: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500",
          remove:
            "bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500",
          reactivate:
            "bg-primary-100 text-primary-700 hover:bg-primary-200 focus-visible:ring-primary-500",
        };

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
        className={`${className} ${palette.print} ${baseBtn}`}
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
                className={`${className} ${palette.edit} ${baseBtn}`}
                aria-label={`Editar venta ${venta.idVentaE}`}
                {...titleProps("Editar")}
              >
                <Edit size={iconSize} aria-hidden="true" />
              </button>

              <button
                onClick={() => onAnular(venta.idVentaE)}
                className={`${className} ${palette.remove} ${baseBtn}`}
                aria-label={`Anular venta ${venta.idVentaE}`}
                {...titleProps("Anular")}
              >
                <Power size={iconSize} aria-hidden="true" />
              </button>
            </>
          )}
        </>
      ) : (
        <>
          {puedeModificar && (
            <button
              onClick={() => onReactivar(venta.idVentaE)}
              className={`${className} ${palette.reactivate} ${baseBtn}`}
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
