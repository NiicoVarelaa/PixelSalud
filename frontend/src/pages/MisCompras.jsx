import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaShoppingCart, FaBoxOpen, FaStore } from "react-icons/fa";
import { FiClock, FiXCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const MisCompras = () => {
  const [ventasAgrupadas, setVentasAgrupadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  // ✅ Obtener user y token del store
  const { user, token } = useAuthStore(); 
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  const ARSformatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  // Función de utilería: Agrupa los resultados planos de la DB por idVentaO
  const agruparVentas = (datos) => {
    const ventas = {};
    datos.forEach((fila) => {
      const {
        idVentaO,
        fechaPago,
        horaPago,
        metodoPago,
        totalPago,
        estado,
        // Eliminados tipoEntrega y direccionEnvio que no existen en la tabla VentasOnlines
        nombreProducto,
        cantidad,
        precioUnitario,
        img,
      } = fila;
      
      // La tabla VentasOnlines no tiene tipoEntrega ni direccionEnvio
      // Usaremos estado para inferir la modalidad

      if (!ventas[idVentaO]) {
        ventas[idVentaO] = {
          idVentaO,
          // Usamos venta.fechaPago y horaPago directamente de la fila
          fechaPago, 
          horaPago,
          metodoPago,
          totalPago: Number(totalPago),
          estado,
          productos: [],
        };
      }
      ventas[idVentaO].productos.push({
        nombreProducto,
        cantidad: Number(cantidad),
        precioUnitario: Number(precioUnitario),
        img,
      });
    });
    return Object.values(ventas);
  };

  const getStatusBadge = (estado) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return {
          icon: <FiClock className="w-4 h-4" />,
          text: "Pendiente",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "retirado":
      case "entregado": // Asumimos 'retirado' es la confirmación final
        return {
          icon: <FaBoxOpen className="w-4 h-4" />,
          text: "Retirado/Entregado",
          color: "bg-purple-100 text-purple-800",
        };
      case "cancelado":
        return {
          icon: <FiXCircle className="w-4 h-4" />,
          text: "Cancelado",
          color: "bg-red-100 text-red-800",
        };
      default:
        return {
          icon: <FiClock className="w-4 h-4" />,
          text: estado,
          color: "bg-gray-100 text-gray-800",
        };
    }
  };
  
  const toggleExpand = (idVentaO) => {
    setExpandedOrder(expandedOrder === idVentaO ? null : idVentaO);
  };
  
  function formatearFechaConDia(fecha) {
    if (!fecha) return "";
    const date = new Date(fecha);
    const opciones = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const fechaFormateada = date.toLocaleDateString("es-AR", opciones);
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  }

  // Hook para cargar las compras
  useEffect(() => {
    if (!user) {
      // Redirige solo si no hay usuario
      navigate("/login");
      return;
    }

    const obtenerCompras = async () => {
      setCargando(true);
      try {
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000";
        
        // ✅ Llamada con token y ruta simplificada (sin :id)
        const respuesta = await axios.get(
            // Asumiendo que la ruta es /ventaOnline/misCompras (desde index.js)
            `${backendUrl}/mis-compras`, 
            {
                // ✅ CRÍTICO: Envío del token en el header 'auth'
                headers: {
                    'auth': `Bearer ${token}` 
                }
            }
        );

        // La respuesta de la DB es plana, por lo que usamos agruparVentas
        const agrupadas = agruparVentas(respuesta.data.results); 
        // Ordenar por la venta más reciente
        agrupadas.sort((a, b) => b.idVentaO - a.idVentaO);
        setVentasAgrupadas(agrupadas);

      } catch (error) {
        console.error("Error al obtener las compras:", error);
        // Si el token falla (401), redirigir al login
        if (error.response && error.response.status === 401) {
            navigate("/login");
        }
      } finally {
        setCargando(false);
      }
    };
    
    // Solo llama si hay token
    if (token) {
        obtenerCompras();
    }
  }, [user, navigate, token]); 


  if (!user) {
    // ... (El bloque se mantiene igual)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-700 font-medium">
              Redirigiendo a inicio de sesión...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cargando) {
    // ... (El bloque se mantiene igual)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 font-medium">
              Cargando tus compras...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esto puede tomar unos segundos
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (ventasAgrupadas.length === 0) {
    // ... (El bloque se mantiene igual)
    return (
      <div className="flex flex-col bg-gray-50 my-16">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaBoxOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Aún no tienes compras registradas
            </h3>
            <p className="mt-2 text-gray-500">
              Cuando realices tu primera compra, aparecerá aquí tu historial.
            </p>
            <div className="mt-6 text-primary-600 font-medium hover:underline">
              <Link to="/productos">Comenzar a comprar</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow max-w-6xl mx-auto  sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <FaShoppingCart className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Mis Compras
                </h1>
                <p className="mt-1 text-gray-600 text-sm md:text-base">
                  Historial de todas tus compras realizadas
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <p className="text-gray-700">
              <span className="font-semibold">Cliente:</span> {user.nombre}
            </p>
          </div>

          <div className="space-y-4">
            {ventasAgrupadas.map((venta) => {
              const badge = getStatusBadge(venta.estado);
              
              // Usamos fechaPago directamente
              const fecha = new Date(venta.fechaPago);
              const fechaDisplay = fecha.toLocaleDateString("es-AR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              });
              
              const productos = venta.productos || [];

              return (
                <div
                  key={venta.idVentaO}
                  className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md"
                >
                  {/* Encabezado de la Compra */}
                  <button
                    className="w-full px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left"
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === venta.idVentaO ? null : venta.idVentaO
                      )
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                           {badge.icon}
                          <h3 className="text-lg font-bold text-gray-800">
                            Orden #{venta.idVentaO}
                          </h3>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}
                        >
                          {/* El icono ya está en badge.icon */}
                          <span className="ml-1">{badge.text}</span>
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {fechaDisplay}
                          {venta.horaPago && (
                            <span> • {venta.horaPago.slice(0, 5)}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          {venta.metodoPago}
                        </div>

                        <div className="flex items-center gap-1">
                          <FaStore className="h-4 w-4 text-orange-500" />
                          Retiro en Tienda
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end sm:items-end mt-2 sm:mt-0">
                      <p className="text-sm text-gray-500">Total de la orden</p>
                      <p className="text-xl font-bold text-primary-600">
                        {ARSformatter.format(venta.totalPago)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {venta.productos.length} producto
                        {venta.productos.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </button>

                  {/* Detalle de Productos (Colapsible) */}
                  {expandedOrder === venta.idVentaO && (
                    <div
                      className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50"
                    >
                      <h3 className="text-sm font-bold text-gray-700 mb-3">
                        Detalles de la Orden
                      </h3>
                      <div className="space-y-4">
                        {productos.map((prod) => (
                          <div
                            key={prod.idProducto}
                            className="flex items-start space-x-4 p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                          >
                            <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border border-gray-100">
                              <img
                                src={prod.img}
                                alt={prod.nombreProducto}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-800">
                                {prod.nombreProducto}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Cantidad:{" "}
                                <span className="font-medium text-gray-700">
                                  {prod.cantidad}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500">
                                Precio:{" "}
                                <span className="font-medium text-gray-700">
                                  {ARSformatter.format(prod.precioUnitario)}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500">
                                Subtotal:{" "}
                                <span className="font-medium text-gray-900">
                                  {ARSformatter.format(
                                    prod.cantidad * prod.precioUnitario
                                  )}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default MisCompras;