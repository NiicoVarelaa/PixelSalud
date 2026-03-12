import { useEffect, useCallback } from "react";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useVentasStore } from "../store/useVentasStore";

export const useVentasData = () => {
  const { setVentas, setCargando } = useVentasStore();

  const obtenerVentas = useCallback(async () => {
    try {
      setCargando(true);
      const res = await apiClient.get("/ventasEmpleados/admin/listado");
      const data = Array.isArray(res.data) ? res.data : [];
      setVentas(data);
    } catch (error) {
      console.error("Error al obtener ventas", error);
      toast.error("Error al cargar historial.");
    } finally {
      setCargando(false);
    }
  }, [setCargando, setVentas]);

  useEffect(() => {
    obtenerVentas();
  }, [obtenerVentas]);

  const handleAnular = useCallback(
    async (idVentaE) => {
      const result = await Swal.fire({
        title: "¿Anular Venta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Sí, anular",
      });

      if (result.isConfirmed) {
        try {
          await apiClient.put(`/ventasEmpleados/anular/${idVentaE}`);
          Swal.fire("Anulada", "Venta anulada.", "success");
          obtenerVentas();
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "No se pudo anular.", "error");
        }
      }
    },
    [obtenerVentas],
  );

  const handleReactivar = useCallback(
    async (idVentaE) => {
      const result = await Swal.fire({
        title: "¿Reactivar Venta?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10B981",
        confirmButtonText: "Sí, reactivar",
      });

      if (result.isConfirmed) {
        try {
          await apiClient.put(`/ventasEmpleados/reactivar/${idVentaE}`);
          Swal.fire("Reactivada", "Venta activa de nuevo.", "success");
          obtenerVentas();
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "No se pudo reactivar.", "error");
        }
      }
    },
    [obtenerVentas],
  );

  const handleVerDetalle = useCallback(async (idVentaE) => {
    Swal.fire({
      title: "Cargando ticket...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await apiClient.get(`/ventasEmpleados/detalle/${idVentaE}`);
      const detalles = res.data;
      const totalCalculado = detalles.reduce(
        (acc, item) => acc + item.cantidad * item.precioUnitario,
        0,
      );

      const formatearMoneda = (val) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(Number(val) || 0);

      let rowsHtml = detalles
        .map(
          (d) => `
            <tr class="border-b border-gray-100 last:border-0">
                <td class="px-4 py-2 text-left text-gray-700 text-xs">${d.nombreProducto}</td>
                <td class="px-4 py-2 text-center text-gray-600 text-xs">${d.cantidad}</td>
                <td class="px-4 py-2 text-right text-gray-500 text-xs">$${new Intl.NumberFormat("es-AR").format(d.precioUnitario)}</td>
                <td class="px-4 py-2 text-right font-bold text-gray-800 text-xs">$${new Intl.NumberFormat("es-AR").format(d.cantidad * d.precioUnitario)}</td>
            </tr>
        `,
        )
        .join("");

      Swal.fire({
        title: `<div class="text-lg font-bold text-gray-800">🧾 Ticket #${idVentaE}</div>`,
        html: `
                <div class="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    <table class="min-w-full text-sm">
                        <thead class="bg-gray-100 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                <th class="px-4 py-2 text-left w-5/12">Prod</th>
                                <th class="px-4 py-2 text-center w-2/12">Cant</th>
                                <th class="px-4 py-2 text-right w-2/12">Unit</th>
                                <th class="px-4 py-2 text-right w-3/12">Sub</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">${rowsHtml}</tbody>
                        <tfoot class="bg-blue-50">
                            <tr>
                                <td colspan="3" class="px-4 py-2 text-right font-bold text-gray-600 text-xs">TOTAL:</td>
                                <td class="px-4 py-2 text-right font-bold text-blue-700 text-sm">${formatearMoneda(totalCalculado)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `,
        width: "500px",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#3B82F6",
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar el detalle", "error");
    }
  }, []);

  return {
    obtenerVentas,
    handleAnular,
    handleReactivar,
    handleVerDetalle,
  };
};
