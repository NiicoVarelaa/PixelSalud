import { useState, useEffect } from "react";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";

const useDashboardData = () => {
  const [data, setData] = useState({
    ventasHoy: { total: 0, transacciones: 0 },
    ventasSemana: { total: 0 },
    productos: { total: 0, activos: 0, stockBajo: 0 },
    productosMasVendidos: [],
    ticketPromedio: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get("/admin/dashboard/metricas");

        if (isMounted && response.data.success) {
          setData({
            ventasHoy: response.data.data.ventasHoy,
            ventasSemana: response.data.data.ventasSemana,
            productos: response.data.data.productos,
            productosMasVendidos: response.data.data.productosMasVendidos || [],
            ticketPromedio: response.data.data.ticketPromedio || 0,
          });
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error al cargar métricas del dashboard:", error);
          setError("No se pudieron cargar las métricas");
          toast.error("Error al cargar las métricas del dashboard");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
};

export default useDashboardData;
