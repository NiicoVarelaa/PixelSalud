import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import { agruparVentas } from "@features/customer/components/orders/ordersUtils";

const useMisCompras = () => {
  const { user, token } = useAuthStore();
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
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        const { data } = await axios.get(`${backendUrl}/mis-compras`, {
          headers: { auth: `Bearer ${token}` },
        });

        setVentasAgrupadas(agruparVentas(data.results || []));
      } catch (error) {
        console.error("Error al obtener compras:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setCargando(false);
      }
    };

    if (token) {
      obtenerCompras();
    }
  }, [navigate, token, user]);

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
