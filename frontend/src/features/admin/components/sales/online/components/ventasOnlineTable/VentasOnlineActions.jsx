import { Edit, Printer } from "lucide-react";

export const VentasOnlineActions = ({
  className,
  iconSize,
  permisos,
  venta,
  onEditar,
  onPrintTicket,
  showTitles = false,
}) => {
  const titleProps = (text) => (showTitles ? { title: text } : {});

  return (
    <>
      <button
        onClick={() => onPrintTicket(venta.idVentaO)}
        className={`${className} bg-orange-100 text-orange-700 hover:bg-orange-200 focus-visible:ring-orange-500`}
        aria-label={`Imprimir ticket online ${venta.idVentaO}`}
        {...titleProps("Imprimir")}
      >
        <Printer size={iconSize} aria-hidden="true" />
      </button>

      {!!permisos.modificar_ventasO && (
        <button
          onClick={() => onEditar(venta)}
          className={`${className} bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500`}
          aria-label={`Editar venta online ${venta.idVentaO}`}
          {...titleProps("Editar")}
        >
          <Edit size={iconSize} aria-hidden="true" />
        </button>
      )}
    </>
  );
};
