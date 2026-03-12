import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import apiClient from "@utils/apiClient";

export const useAuditoriaData = (filtros) => {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarAuditorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filtros.modulo) params.append("modulo", filtros.modulo);
      if (filtros.tipoUsuario)
        params.append("tipoUsuario", filtros.tipoUsuario);
      if (filtros.fechaDesde) params.append("fechaDesde", filtros.fechaDesde);
      if (filtros.fechaHasta) params.append("fechaHasta", filtros.fechaHasta);
      params.append("limite", filtros.limite);
      params.append("offset", filtros.offset);

      const response = await apiClient.get(
        `/admin/auditoria?${params.toString()}`,
      );

      if (response.data.success) {
        setAuditorias(response.data.data || []);
      }
    } catch (error) {
      console.error("Error al cargar auditorías:", error);
      setError("No se pudieron cargar los registros de auditoría");
      toast.error("Error al cargar auditorías");
      setAuditorias([]);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargarAuditorias();
  }, [cargarAuditorias]);

  return {
    auditorias,
    loading,
    error,
    cargarAuditorias,
  };
};
