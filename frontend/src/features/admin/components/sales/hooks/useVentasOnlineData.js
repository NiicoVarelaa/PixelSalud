import { useEffect, useCallback } from "react";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useVentasOnlineStore } from "../store/useVentasOnlineStore";

export const useVentasOnlineData = () => {
  const { setVentas, setProductosDisponibles, setCargando, updateVentaEstado } =
    useVentasOnlineStore();

  const obtenerDatos = useCallback(async () => {
    try {
      setCargando(true);
      const [resVentas, resProd] = await Promise.all([
        apiClient.get("/ventasOnline/todas"),
        apiClient.get("/productos"),
      ]);

      // Deduplicación de ventas
      const rawVentas = resVentas.data.results || resVentas.data || [];
      const ventasUnicas = [];
      const map = new Map();
      for (const item of rawVentas) {
        if (!map.has(item.idVentaO)) {
          map.set(item.idVentaO, true);
          ventasUnicas.push(item);
        }
      }

      setVentas(ventasUnicas);

      // Filtrar productos activos
      const prods = resProd.data.results || resProd.data || [];
      setProductosDisponibles(prods.filter((p) => p.activo));
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Error al cargar datos.");
    } finally {
      setCargando(false);
    }
  }, [setCargando, setVentas, setProductosDisponibles]);

  useEffect(() => {
    obtenerDatos();
  }, [obtenerDatos]);

  const handleEstadoChange = useCallback(
    async (idVentaO, nuevoEstado) => {
      try {
        const estadoLower = nuevoEstado.toLowerCase();
        await apiClient.put("/ventaOnline/estado", {
          idVentaO,
          nuevoEstado: estadoLower,
        });

        updateVentaEstado(idVentaO, estadoLower);
        toast.success(`Estado cambiado a: ${nuevoEstado}`);
      } catch (error) {
        console.error(error);
        toast.error("Error al cambiar estado.");
      }
    },
    [updateVentaEstado],
  );

  const handleVerDetalle = useCallback(async (venta) => {
    Swal.fire({ title: "Cargando...", didOpen: () => Swal.showLoading() });
    try {
      const res = await apiClient.get(
        `/ventasOnline/detalle/${venta.idVentaO}`,
      );
      const detalles = res.data;

      const formatearMoneda = (val) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(Number(val) || 0);

      let rows = detalles
        .map(
          (d) => `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px; text-align: left;">${d.nombreProducto}</td>
                <td style="padding: 8px; text-align: center;">${d.cantidad}</td>
                <td style="padding: 8px; text-align: right;">$${d.precioUnitario}</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">$${d.cantidad * d.precioUnitario}</td>
            </tr>`,
        )
        .join("");

      const envioInfo =
        venta.tipoEntrega === "Envio"
          ? `<div style="background: #eff6ff; padding: 10px; border-radius: 8px; margin-bottom: 10px; text-align: left; font-size: 12px; color: #1e40af;">
                <strong>🚚 Envío:</strong> ${venta.direccion || "Sin dirección"} (${venta.ciudad || "-"})
             </div>`
          : "";

      Swal.fire({
        title: `<span style="color: #333;">Orden #${venta.idVentaO}</span>`,
        html: `
                <div style="font-size: 14px; margin-bottom: 10px; text-align: left;">
                    <strong>Cliente:</strong> ${venta.nombreCliente} ${venta.apellidoCliente}<br/>
                    <strong>DNI:</strong> ${venta.dni || "-"}<br/>
                </div>
                ${envioInfo}
                <div style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    <table width="100%" style="font-size: 13px; border-collapse: collapse;">
                        <thead style="background: #f3f4f6;">
                            <tr>
                                <th style="padding: 8px; text-align: left;">Prod</th>
                                <th style="padding: 8px; text-align: center;">Cant</th>
                                <th style="padding: 8px; text-align: right;">$ Unit</th>
                                <th style="padding: 8px; text-align: right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                        <tfoot style="background: #f9fafb;">
                            <tr>
                                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">TOTAL:</td>
                                <td style="padding: 10px; text-align: right; font-weight: bold; color: #4338ca; font-size: 15px;">
                                    ${formatearMoneda(venta.totalPago)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `,
        width: "600px",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "Cerrar",
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar detalle", "error");
    }
  }, []);

  return {
    obtenerDatos,
    handleEstadoChange,
    handleVerDetalle,
  };
};
