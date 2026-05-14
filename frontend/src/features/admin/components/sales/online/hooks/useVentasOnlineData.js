import { useEffect, useCallback } from "react";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useVentasOnlineStore } from "../store/useVentasOnlineStore";
import Default from "@assets/default.webp";
import { formatMoneda as formatearMoneda } from "@utils/formatMoneda";

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
    Swal.fire({
      title: "Cargando ticket...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await apiClient.get(
        `/ventasOnline/detalle/${venta.idVentaO}`,
      );
      const detalles = Array.isArray(res.data) ? res.data : [];

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

      const envioInfo =
        String(venta?.tipoEntrega || "").toLowerCase() === "envio"
          ? `
            <div class="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
              <p><span class="font-semibold">Tipo:</span> Envio</p>
              <p><span class="font-semibold">Direccion:</span> ${escaparHtml(venta?.direccion || "Sin direccion")}</p>
              <p><span class="font-semibold">Ciudad:</span> ${escaparHtml(venta?.ciudad || "-")}</p>
            </div>
          `
          : "";

      const rowsHtml = detallesConImagen
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
        title: `<div class="flex items-center justify-center gap-2 text-gray-800"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100">${ticketIconSvg}</span><span class="text-lg font-extrabold">Detalle Ticket #${venta.idVentaO}</span></div>`,
        html: `
                <div class="mt-3 space-y-3 text-left">
                  ${envioInfo}

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
      Swal.fire("Error", "No se pudo cargar detalle", "error");
    }
  }, []);

  return {
    handleEstadoChange,
    handleVerDetalle,
    obtenerDatos,
  };
};
