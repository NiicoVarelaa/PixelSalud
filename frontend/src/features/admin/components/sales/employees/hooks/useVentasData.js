import { useEffect, useCallback } from "react";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useVentasStore } from "../store/useVentasStore";
import Default from "@assets/default.webp";

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

      const detallesConImagen = await Promise.all(
        detalles.map(async (detalle) => {
          const imagenLocal =
            detalle.img ||
            detalle.urlImagen ||
            detalle.imagen ||
            detalle.imagenPrincipal;

          if (imagenLocal) {
            return { ...detalle, imagenProductoUrl: imagenLocal };
          }

          if (!detalle.idProducto) {
            return { ...detalle, imagenProductoUrl: Default };
          }

          try {
            const resImagen = await apiClient.get(
              `/productos/${detalle.idProducto}/imagenes/principal`,
            );
            return {
              ...detalle,
              imagenProductoUrl: resImagen.data?.urlImagen || Default,
            };
          } catch {
            return { ...detalle, imagenProductoUrl: Default };
          }
        }),
      );

      const totalCalculado = detalles.reduce(
        (acc, item) => acc + item.cantidad * item.precioUnitario,
        0,
      );

      const formatearMoneda = (val) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(Number(val) || 0);

      const escaparHtml = (texto) =>
        String(texto || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");

      const ticketIconSvg = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-700">
          <path d="M8 3h8a2 2 0 0 1 2 2v3h2v8h-2v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3H4V8h2V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      `;

      let rowsHtml = detallesConImagen
        .map(
          (d) => `
            <li class="rounded-xl border border-gray-100 bg-white px-3 py-3">
              <div class="flex items-start gap-3">
                <div class="h-14 w-14 shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                  <img
                    src="${escaparHtml(d.imagenProductoUrl)}"
                    alt="${escaparHtml(d.nombreProducto)}"
                    class="h-full w-full object-cover"
                    onerror="this.onerror=null;this.src='${Default}'"
                  />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <p class="text-sm font-semibold text-gray-800 leading-tight">${escaparHtml(d.nombreProducto)}</p>
                    <p class="text-sm font-black text-green-700 shrink-0">${formatearMoneda(d.cantidad * d.precioUnitario)}</p>
                  </div>

                  <div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-semibold text-gray-700">Cant: ${d.cantidad}</span>
                    <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-semibold text-gray-700">Unit: ${formatearMoneda(d.precioUnitario)}</span>
                  </div>
                </div>
              </div>
            </li>
        `,
        )
        .join("");

      Swal.fire({
        title: `<div class="flex items-center justify-center gap-2 text-gray-800"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100">${ticketIconSvg}</span><span class="text-lg font-extrabold">Detalle Ticket #${idVentaE}</span></div>`,
        html: `
                <div class="mt-3 space-y-3 text-left">
                  <div class="rounded-xl border border-gray-200 bg-linear-to-r from-green-50 to-emerald-50 px-4 py-3 flex items-center justify-between">
                    <p class="text-xs font-bold uppercase tracking-wide text-gray-600">Total del ticket</p>
                    <p class="text-xl font-black text-green-700">${formatearMoneda(totalCalculado)}</p>
                  </div>

                  <div class="rounded-xl border border-gray-200 bg-gray-50 p-2 max-h-[340px] overflow-y-auto">
                    <ul class="space-y-2">${rowsHtml}</ul>
                  </div>
                </div>
            `,
        width: "560px",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#16A34A",
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
