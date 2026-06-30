import { useNavigate } from "react-router-dom";
import { Clock, CreditCard, ShoppingCart, Store } from "lucide-react";
import { formatFecha, formatMoneda } from "../utils/dashboard.utils";

const RecentSalesCard = ({ venta }) => {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`editar-venta/${venta.idVentaE}`)}
      className="rounded-xl border border-gray-100 bg-white p-4 cursor-pointer hover:border-green-200 hover:shadow-sm transition-all active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium text-gray-400">#{String(venta.idVentaE).padStart(3, "0")}</span>
        <span className="text-sm font-bold text-gray-900 tabular-nums">{formatMoneda(venta.totalPago)}</span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <Clock size={12} className="text-gray-300 shrink-0" />
        <span>{formatFecha(venta.fechaPago)}</span>
        <span className="text-gray-200">·</span>
        <CreditCard size={12} className="text-gray-300 shrink-0" />
        <span className="capitalize">{venta.metodoPago}</span>
      </div>
    </article>
  );
};

const RecentSalesTable = ({ ventasRecientes }) => {
  const navigate = useNavigate();

  if (ventasRecientes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-4">
          <ShoppingCart size={24} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700">Aún no hay ventas</p>
        <p className="mt-1 text-xs text-gray-400 max-w-xs">
          Cuando registres tu primera venta, aparecerá en este listado
        </p>
        <button
          onClick={() => navigate("venta")}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-colors cursor-pointer"
        >
          <ShoppingCart size={14} /> Realizar venta
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="space-y-2.5 p-4 lg:hidden">
        {ventasRecientes.slice(0, 5).map((venta) => (
          <RecentSalesCard key={venta.idVentaE} venta={venta} />
        ))}
        {ventasRecientes.length > 5 && (
          <button
            onClick={() => navigate("misventas")}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-3 text-xs font-medium text-gray-500 hover:border-green-300 hover:text-green-600 hover:bg-green-50/40 transition-all cursor-pointer"
          >
            <Store size={14} /> Ver todas las ventas
          </button>
        )}
      </div>

      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                {["Venta", "Fecha", "Método", "Total"].map((col, i) => (
                  <th
                    key={col}
                    className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 ${i === 3 ? "text-right" : "text-left"}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ventasRecientes.map((venta) => (
                <tr
                  key={venta.idVentaE}
                  className="transition-colors hover:bg-green-50/30 group cursor-pointer"
                  onClick={() => navigate(`editar-venta/${venta.idVentaE}`)}
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono font-medium text-gray-800">#{venta.idVentaE}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-gray-300 shrink-0" />
                      <span className="text-sm text-gray-500">{formatFecha(venta.fechaPago)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 capitalize text-sm text-gray-600">
                      <CreditCard size={13} className="text-gray-300" />
                      {venta.metodoPago}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className="text-sm font-bold text-gray-900">{formatMoneda(venta.totalPago)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-50 bg-gray-50/30 px-4 py-2.5">
          <p className="text-center text-[11px] text-gray-400">
            {ventasRecientes.length} venta{ventasRecientes.length !== 1 ? "s" : ""} reciente{ventasRecientes.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentSalesTable;
