import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import apiClient from "@utils/apiClient";

export const useAuditoriaData = (filtros) => {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, limite: 0, offset: 0 });

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
        setPagination({
          total: response.data.total ?? 0,
          limite: response.data.limite ?? filtros.limite,
          offset: response.data.offset ?? filtros.offset,
        });
      }
    } catch (error) {
      console.error("Error al cargar auditorías:", error);
      setError("No se pudieron cargar los registros de auditoría");
      toast.error("Error al cargar auditorías");
      setAuditorias([]);
      setPagination({ total: 0, limite: 0, offset: 0 });
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargarAuditorias();
  }, [cargarAuditorias]);

  return {
    auditorias,
    pagination,
    error,
    loading,
    cargarAuditorias,
  };
};
