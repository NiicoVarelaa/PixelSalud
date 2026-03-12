import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import apiClient from "@utils/apiClient";
import { REPORT_FILE_NAMES } from "../constants/reportData";

/**
 * Hook personalizado para gestionar la descarga de reportes
 * @param {Object} filters - Filtros aplicados
 * @returns {Object} - Estado y función de descarga
 */
export const useReportDownload = (filters) => {
  const [downloading, setDownloading] = useState({
    "ventas-online": false,
    "ventas-empleados": false,
    consolidado: false,
    "productos-vendidos": false,
  });

  /**
   * Construye la URL con parámetros de filtros según el tipo de reporte
   */
  const buildReportUrl = useCallback(
    (tipo) => {
      const params = new URLSearchParams();

      if (filters.fechaDesde) params.append("fechaDesde", filters.fechaDesde);
      if (filters.fechaHasta) params.append("fechaHasta", filters.fechaHasta);

      if (tipo === "ventas-online" || tipo === "ventas-empleados") {
        if (filters.estado !== "Todos") params.append("estado", filters.estado);
        if (filters.metodoPago !== "Todos")
          params.append("metodoPago", filters.metodoPago);
      } else if (tipo === "productos-vendidos") {
        if (filters.categoria !== "Todas")
          params.append("categoria", filters.categoria);
      }

      return `/reportes/${tipo}?${params.toString()}`;
    },
    [filters],
  );

  /**
   * Maneja errores de descarga mostrando mensajes apropiados
   */
  const handleDownloadError = useCallback(async (error) => {
    console.error("Error descargando reporte:", error);

    // Leer el mensaje de error del Blob si existe
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const errorData = JSON.parse(text);
        console.error("Error del servidor:", errorData);
      } catch {
        console.error("No se pudo parsear el error");
      }
    }

    // Mostrar mensaje según el tipo de error
    const errorMessages = {
      403: "No tienes permisos para generar reportes",
      401: "Sesión expirada, inicia sesión nuevamente",
      500: "Error en el servidor al generar reporte",
    };

    const message =
      errorMessages[error.response?.status] || "Error al descargar el reporte";

    toast.error(message, {
      icon: "❌",
    });
  }, []);

  /**
   * Descarga un archivo blob como Excel
   */
  const downloadBlob = useCallback((blob, tipo) => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${REPORT_FILE_NAMES[tipo]}_${Date.now()}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Liberar el objeto URL
    window.URL.revokeObjectURL(link.href);
  }, []);

  /**
   * Descarga un reporte específico
   */
  const downloadReport = useCallback(
    async (tipo) => {
      try {
        setDownloading((prev) => ({ ...prev, [tipo]: true }));

        const url = buildReportUrl(tipo);
        const response = await apiClient.get(url, {
          responseType: "blob",
        });

        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        downloadBlob(blob, tipo);

        toast.success("Reporte descargado exitosamente", {
          icon: "✅",
        });
      } catch (error) {
        handleDownloadError(error);
      } finally {
        setDownloading((prev) => ({ ...prev, [tipo]: false }));
      }
    },
    [buildReportUrl, downloadBlob, handleDownloadError],
  );

  return {
    downloading,
    downloadReport,
  };
};
