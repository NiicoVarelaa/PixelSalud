import { useEffect, useState } from "react";
import { getCliente } from "../store/useClienteStore";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaShoppingCart, FaBoxOpen, FaTruck, FaStore } from "react-icons/fa";
import { FiClock, FiCheckCircle, FiXCircle, FiTruck } from "react-icons/fi";
import { Link } from "react-router-dom";

const MisCompras = () => {
  const [ventasAgrupadas, setVentasAgrupadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cliente, setCliente] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const ARSformatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const clienteData = await getCliente();
        setCliente(clienteData);
        // --- CÓDIGO CORREGIDO ---
        const idCliente = clienteData; // Vuelve a la lógica original de tu código
        // --- FIN DEL CÓDIGO CORREGIDO ---
        const respuesta = await axios.get(
          `http://localhost:5000/ventaOnline/misCompras/${idCliente}`
        );
        const agrupadas = agruparVentas(respuesta.data.results);
        agrupadas.sort((a, b) => b.idVentaO - a.idVentaO);
        setVentasAgrupadas(agrupadas);
      } catch (error) {
        console.error("Error al obtener las compras:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerCompras();
  }, []);

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
        tipoEntrega,
        direccionEnvio,
        nombreProducto,
        cantidad,
        precioUnitario,
        img,
      } = fila;

      if (!ventas[idVentaO]) {
        ventas[idVentaO] = {
          idVentaO,
          fechaPago,
          horaPago,
          metodoPago,
          totalPago: Number(totalPago),
          estado,
          tipoEntrega,
          direccionEnvio,
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

  const getStatusIcon = (estado) => {
    switch (estado) {
      case "Pendiente":
        return <FiClock className="text-yellow-600" />;
      case "Enviado":
        return <FiTruck className="text-blue-600" />;
      case "Entregado":
      case "Retirado":
        return <FiCheckCircle className="text-green-600" />;
      case "Cancelado":
        return <FiXCircle className="text-red-600" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getDeliveryIcon = (tipoEntrega) => {
    switch (tipoEntrega) {
      case "Envio":
        return <FaTruck className="text-blue-500" />;
      case "Sucursal":
        return <FaStore className="text-orange-500" />;
      default:
        return <FaTruck className="text-gray-500" />;
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-pulse">
              <FaShoppingCart className="h-16 w-16 text-primary-500 mb-4" />
            </div>
            <p className="text-lg text-gray-700 font-medium">Cargando tus compras...</p>
            <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (ventasAgrupadas.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
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
            <Link to="/productos" className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Comenzar a comprar
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
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

          {cliente && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Cliente:</span> {cliente.nombreCliente}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {ventasAgrupadas.map((venta) => (
              <div
                key={venta.idVentaO}
                className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md"
              >
                <button
                  className="w-full px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left"
                  onClick={() => setExpandedOrder(expandedOrder === venta.idVentaO ? null : venta.idVentaO)}
                >
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(venta.estado)}
                        <h3 className="text-lg font-bold text-gray-800">
                          Orden #{venta.idVentaO}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          ${venta.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" : ""}
                          ${venta.estado === "Enviado" ? "bg-blue-100 text-blue-800" : ""}
                          ${venta.estado === "Entregado" || venta.estado === "Retirado"
                            ? "bg-green-100 text-green-800"
                            : ""}
                          ${venta.estado === "Cancelado" ? "bg-red-100 text-red-800" : ""}
                        `}
                      >
                        {venta.estado}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatearFechaConDia(venta.fechaPago)}
                        {venta.horaPago && <span> • {venta.horaPago.slice(0, 5)}</span>}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        {venta.metodoPago}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {getDeliveryIcon(venta.tipoEntrega)}
                        {venta.tipoEntrega}
                        {venta.tipoEntrega === "Envio" && venta.direccionEnvio && (
                          <span className="ml-1 truncate max-w-[150px] sm:max-w-full">• {venta.direccionEnvio}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end sm:items-end mt-2 sm:mt-0">
                    <p className="text-sm text-gray-500">Total de la orden</p>
                    <p className="text-xl font-bold text-primary-600">
                      {ARSformatter.format(venta.totalPago)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {venta.productos.length} producto{venta.productos.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </button>

                {expandedOrder === venta.idVentaO && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50">
                    {/* Vista para escritorio */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Producto
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cantidad
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Precio
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {venta.productos.map((prod, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  {prod.img ? (
                                    <img
                                      src={prod.img}
                                      alt={prod.nombreProducto}
                                      className="h-10 w-10 object-contain rounded"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                                      <FaBoxOpen className="text-gray-400" />
                                    </div>
                                  )}
                                  <div className="text-sm font-medium text-gray-900">
                                    {prod.nombreProducto}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {prod.cantidad}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {ARSformatter.format(prod.precioUnitario)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {ARSformatter.format(
                                  prod.cantidad * prod.precioUnitario
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Vista para móvil */}
                    <div className="sm:hidden space-y-4">
                      {venta.productos.map((prod, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex-shrink-0">
                            {prod.img ? (
                              <img
                                src={prod.img}
                                alt={prod.nombreProducto}
                                className="h-16 w-16 object-contain rounded-lg"
                              />
                            ) : (
                              <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FaBoxOpen className="text-gray-400 text-xl" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-800">{prod.nombreProducto}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Cantidad: <span className="font-medium text-gray-700">{prod.cantidad}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Precio: <span className="font-medium text-gray-700">{ARSformatter.format(prod.precioUnitario)}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Subtotal: <span className="font-medium text-gray-900">{ARSformatter.format(prod.cantidad * prod.precioUnitario)}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MisCompras;