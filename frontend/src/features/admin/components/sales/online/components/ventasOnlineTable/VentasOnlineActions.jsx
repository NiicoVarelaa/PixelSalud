import { Edit, Printer } from "lucide-react";

export const VentasOnlineActions = ({
  className,
  iconSize,
  permisos,
  venta,
  onEditar,
  onPrintTicket,
  showTitles = false,
  tone = "soft",
}) => {
  const titleProps = (text) => (showTitles ? { title: text } : {});
  const palette =
    tone === "strong"
      ? {
          print:
            "bg-orange-200 text-orange-800 hover:bg-orange-300 focus-visible:ring-orange-600",
          edit: "bg-yellow-200 text-yellow-800 hover:bg-yellow-300 focus-visible:ring-yellow-600",
        }
      : {
          print:
            "bg-orange-100 text-orange-700 hover:bg-orange-200 focus-visible:ring-orange-500",
          edit: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500",
        };

  return (
    <>
      <button
        onClick={() => onPrintTicket(venta.idVentaO)}
        className={`${className} ${palette.print}`}
        aria-label={`Imprimir ticket online ${venta.idVentaO}`}
        {...titleProps("Imprimir")}
      >
        <Printer size={iconSize} aria-hidden="true" />
      </button>

      {!!permisos.modificar_ventasO && (
        <button
          onClick={() => onEditar(venta)}
          className={`${className} ${palette.edit}`}
          aria-label={`Editar venta online ${venta.idVentaO}`}
          {...titleProps("Editar")}
        >
          <Edit size={iconSize} aria-hidden="true" />
        </button>
      )}
    </>
  );
};
