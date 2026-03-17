import { useState, useEffect } from "react";
import apiClient from "@utils/apiClient";

export function useTicket(idVenta, tipo, show) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && idVenta) {
      setLoading(true);
      setError(null);
      const endpoint =
        tipo === "empleado"
          ? `/ticket/empleado/${idVenta}`
          : `/ticket/online/${idVenta}`;
      apiClient
        .get(endpoint)
        .then((res) => setTicket(res.data.data))
        .catch((err) =>
          setError(err.response?.data?.message || "Error al cargar el ticket."),
        )
        .finally(() => setLoading(false));
    }
  }, [show, idVenta, tipo]);

  return { ticket, loading, error };
}
