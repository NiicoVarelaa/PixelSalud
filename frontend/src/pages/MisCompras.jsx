import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  CalendarDays, 
  CreditCard, 
  ChevronDown,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MisCompras = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [ventasAgrupadas, setVentasAgrupadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const ARSformatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  const agruparVentas = (datos) => {
    const ventas = {};
    datos.forEach((fila) => {
      const { idVentaO, fechaPago, horaPago, metodoPago, totalPago, estado, nombreProducto, cantidad, precioUnitario, img } = fila;
      if (!ventas[idVentaO]) {
        ventas[idVentaO] = {
          idVentaO,
          fechaPago,
          horaPago,
          metodoPago,
          totalPago: Number(totalPago),
          estado,
          productos: [],
        };
      }
      ventas[idVentaO].productos.push({
        nombreProducto,
        cantidad: Number(cantidad),
        precioUnitario: Number(precioUnitario),
        img,
      });
    });
    return Object.values(ventas).sort((a, b) => b.idVentaO - a.idVentaO);
  };

  useEffect(() => {
    if (!user) return navigate("/login");

    const obtenerCompras = async () => {
      setCargando(true);
      try {
        const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const { data } = await axios.get(`${backendUrl}/mis-compras`, {
          headers: { 'auth': `Bearer ${token}` }
        });
        setVentasAgrupadas(agruparVentas(data.results));
      } catch (error) {
        console.error("Error:", error);
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setCargando(false);
      }
    };
    if (token) obtenerCompras();
  }, [user, navigate, token]);

  const getStatusConfig = (estado) => {
    switch (estado?.toLowerCase()) {
      case "pendiente":
        return { icon: <Clock size={14} strokeWidth={2.5} />, className: "text-amber-700 bg-amber-50 border-amber-200", label: "Pendiente" };
      case "retirado":
      case "entregado":
        return { icon: <CheckCircle2 size={14} strokeWidth={2.5} />, className: "text-emerald-700 bg-emerald-50 border-emerald-200", label: "Completado" };
      case "cancelado":
        return { icon: <XCircle size={14} strokeWidth={2.5} />, className: "text-rose-700 bg-rose-50 border-rose-200", label: "Cancelado" };
      default:
        return { icon: <Package size={14} strokeWidth={2.5} />, className: "text-slate-700 bg-slate-50 border-slate-200", label: estado };
    }
  };

  if (cargando) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Cargando tus pedidos...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Mis Compras</h2>
          <p className="text-slate-500 mt-1 text-sm">Historial de pedidos y facturación</p>
        </div>
      </div>

      {ventasAgrupadas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="text-primary-500" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No tienes pedidos aún</h3>
          <p className="text-slate-500 mt-2 mb-6 max-w-xs mx-auto">
            Parece que no has realizado ninguna compra. ¡Explora nuestra tienda!
          </p>
          <Link 
            to="/productos" 
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 active:scale-95"
          >
            Ir a la tienda <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {ventasAgrupadas.map((venta) => {
            const status = getStatusConfig(venta.estado);
            const isExpanded = expandedOrder === venta.idVentaO;
            const fecha = new Date(venta.fechaPago).toLocaleDateString("es-AR", { 
              day: 'numeric', month: 'long', year: 'numeric' 
            });

            return (
              <div 
                key={venta.idVentaO} 
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isExpanded ? 'border-primary-200 shadow-lg shadow-primary-900/5' : 'border-slate-200 shadow-sm hover:shadow-md hover:border-primary-100'}
                `}
              >
                <div 
                  onClick={() => setExpandedOrder(isExpanded ? null : venta.idVentaO)}
                  className="p-5 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl hidden sm:flex ${isExpanded ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400'}`}>
                        <Package size={24} />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-slate-900 text-lg">Orden #{venta.idVentaO}</span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${status.className}`}>
                            {status.icon}
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {fecha}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <div className="flex items-center gap-1.5">
                            <CreditCard size={14} />
                            {venta.metodoPago}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 pl-14 md:pl-0">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-medium uppercase">Total</span>
                        <div className="text-xl font-bold text-slate-900">
                          {ARSformatter.format(venta.totalPago)}
                        </div>
                      </div>
                      <div className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-primary-600 text-white rotate-180' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden bg-slate-50/50 border-t border-slate-100">
                    <div className="p-5">
                      <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <ShoppingBag size={16} className="text-primary-600" />
                        Productos ({venta.productos.length})
                      </h4>
                      
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {venta.productos.map((prod, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div className="w-14 h-14 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-100">
                              {prod.img ? (
                                <img src={prod.img} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <Package size={20} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-900 truncate">{prod.nombreProducto}</p>
                              <div className="flex justify-between items-end mt-1">
                                <p className="text-xs text-slate-500">{prod.cantidad} x {ARSformatter.format(prod.precioUnitario)}</p>
                                <p className="text-sm font-semibold text-slate-700">{ARSformatter.format(prod.cantidad * prod.precioUnitario)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MisCompras;