import { useState, useEffect } from "react";
import apiClient from "@utils/apiClient";

const useChartData = (dias = 7) => {
  const [ventasData, setVentasData] = useState([]);
  const [productosData, setProductosData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchChartData = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get(
          `/admin/dashboard/grafico-ventas?dias=${dias}`,
        );

        if (isMounted && response.data.success) {
          const rawData = response.data.data.datos;

          const formattedVentasData = rawData.map((venta) => ({
            fecha: new Date(venta.fecha).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "short",
            }),
            total: venta.total,
          }));

          const formattedProductosData = rawData.map((venta) => ({
            fecha: new Date(venta.fecha).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "short",
            }),
            cantidad: venta.transacciones,
          }));

          setVentasData(formattedVentasData);
          setProductosData(formattedProductosData);
        }
      } catch (error) {
        console.error("Error al cargar datos del gráfico:", error);
        if (isMounted) {
          setVentasData([]);
          setProductosData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchChartData();

    return () => {
      isMounted = false;
    };
  }, [dias]);

  return { ventasData, productosData, loading };
};

export default useChartData;
