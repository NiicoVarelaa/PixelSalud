import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import apiClient from "@utils/apiClient";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  User,
  DollarSign,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import Skeleton from "../components/dashboard/panels/DashboardSkeleton";
import StatCard from "../components/dashboard/panels/StatCard";
import QuickAccessCard from "../components/dashboard/panels/QuickAccessCard";
import RecentSalesTable from "../components/dashboard/panels/RecentSalesTable";
import { formatMoneda, COLORS } from "../components/dashboard/utils/dashboard.utils";

const DashboardEmpleado = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const permisos = user?.permisos || {};
  const mostrarVentasTotales =
    permisos.ver_ventasTotalesE === 1 || permisos.ver_ventasTotalesE === true;

  const [stats, setStats] = useState({ ventasHoy: 0, totalHoy: 0, ventasMes: 0, totalMes: 0 });
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const idEmpleado = user?.idEmpleado || user?.id;
      const res = await apiClient.get(`/ventasEmpleados/${idEmpleado}`);
      const ventas = Array.isArray(res.data) ? res.data : [];

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

      let ventasHoy = 0, totalHoy = 0, ventasMes = 0, totalMes = 0;

      ventas.forEach((v) => {
        if (v.estado === "anulada") return;
        const fecha = new Date(v.fechaPago);
        if (fecha >= hoy) { ventasHoy++; totalHoy += Number(v.totalPago) || 0; }
        if (fecha >= inicioMes) { ventasMes++; totalMes += Number(v.totalPago) || 0; }
      });

      setStats({ ventasHoy, totalHoy, ventasMes, totalMes });
      setVentasRecientes(ventas.filter((v) => v.estado !== "anulada").slice(0, 5));
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    } finally {
      setCargando(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) cargarDatos();
  }, [user, cargarDatos]);

  if (cargando) return <Skeleton />;

  const iniciales = `${user?.nombre?.charAt(0) || ""}${user?.apellido?.charAt(0) || ""}`.toUpperCase();
  const hoy = new Date();
  const fechaBonita = hoy.toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white shadow-md shadow-green-600/25">
            {iniciales}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Hola, {user?.nombre}
            </h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
              <CalendarDays size={14} className="text-gray-400" />
              {fechaBonita}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("venta")}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-green-600/30 active:scale-95 cursor-pointer"
        >
          <ShoppingCart size={17} />
          Nueva venta
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShoppingCart} label="Ventas hoy" value={stats.ventasHoy} color={COLORS.green} />
        <StatCard icon={DollarSign} label="Total hoy" value={formatMoneda(stats.totalHoy)} color={COLORS.green} />
        <StatCard icon={TrendingUp} label="Ventas del mes" value={stats.ventasMes} color={COLORS.amber} />
        <StatCard icon={DollarSign} label="Total del mes" value={formatMoneda(stats.totalMes)} color={COLORS.purple} />
      </div>

      <div className="mb-8">
        <h2 className="mb-3.5 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickAccessCard
            icon={ShoppingCart} label="Realizar venta" description="Nuevo ticket"
            color={COLORS.green} onClick={() => navigate("venta")}
          />
          <QuickAccessCard
            icon={Package} label="Productos" description="Consultar stock"
            color={COLORS.amber} onClick={() => navigate("productos")}
          />
          <QuickAccessCard
            icon={User} label="Mis ventas" description="Historial personal"
            color={COLORS.green} onClick={() => navigate("misventas")}
          />
          {mostrarVentasTotales && (
            <QuickAccessCard
              icon={TrendingUp} label="Ventas totales" description="Todas las ventas"
              color={COLORS.purple} onClick={() => navigate("ventastotales")}
            />
          )}
        </div>
      </div>

      <div>
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
            Últimas ventas
          </h2>
          {ventasRecientes.length > 0 && (
            <button
              onClick={() => navigate("misventas")}
              className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 transition-colors cursor-pointer"
            >
              Ver todas <ArrowRight size={12} />
            </button>
          )}
        </div>

        <RecentSalesTable ventasRecientes={ventasRecientes} />
      </div>
    </div>
  );
};

export default DashboardEmpleado;
