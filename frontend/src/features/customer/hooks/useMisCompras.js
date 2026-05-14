import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import apiClient from "@utils/apiClient";
import { agruparVentas } from "@features/customer/components/orders/ordersUtils";

const useMisCompras = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [ventasAgrupadas, setVentasAgrupadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [ticketModal, setTicketModal] = useState({
    show: false,
    idVenta: null,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const obtenerCompras = async () => {
      setCargando(true);
      try {
        const { data } = await apiClient.get("/mis-compras");
        setVentasAgrupadas(agruparVentas(data.results || []));
      } catch (error) {
        console.error("Error al obtener compras:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerCompras();
  }, [navigate, user]);

  const toggleOrder = useCallback((idVenta) => {
    setExpandedOrder((prev) => (prev === idVenta ? null : idVenta));
  }, []);

  const openTicket = useCallback((idVenta) => {
    setTicketModal({ show: true, idVenta });
  }, []);

  const closeTicket = useCallback(() => {
    setTicketModal({ show: false, idVenta: null });
  }, []);

  return {
    cargando,
    expandedOrder,
    ticketModal,
    ventasAgrupadas,
    closeTicket,
    openTicket,
    toggleOrder,
  };
};

export default useMisCompras;
