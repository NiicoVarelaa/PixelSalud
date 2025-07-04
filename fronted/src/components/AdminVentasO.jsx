import { useState, useEffect } from "react";
import axios from "axios";

const AdminVentasO = () => {
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [orden, setOrden] = useState({ campo: "fechaPago", direccion: "desc" });
  const [cargando, setCargando] = useState(true);

  const obtenerVentas = async () => {
    try {
      setCargando(true);
      const res = await axios.get("http://localhost:5000/ventasOnline/todas");
      setVentas(res.data.results || []);
      setVentasFiltradas(res.data.results || []);
    } catch (error) {
      console.error("Error al obtener las ventas", error);
      setVentas([]);
      setVentasFiltradas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  useEffect(() => {
    const resultados = ventas.filter((venta) => {
      if (!venta) return false;
      
      const busqueda = filtro.toLowerCase();
      return (
        (venta.nombreCliente?.toLowerCase() || "").includes(busqueda) ||
        (venta.nombreProducto?.toLowerCase() || "").includes(busqueda) ||
        (venta.metodoPago?.toLowerCase() || "").includes(busqueda) ||
        (venta.fechaPago || "").includes(busqueda)
      );
    });
    setVentasFiltradas(resultados);
  }, [filtro, ventas]);

  const ordenarVentas = (campo) => {
    const direccion = orden.campo === campo && orden.direccion === "asc" ? "desc" : "asc";
    setOrden({ campo, direccion });

    setVentasFiltradas([...ventasFiltradas].sort((a, b) => {
      if (!a || !b) return 0;
      const valA = a[campo] || "";
      const valB = b[campo] || "";
      
      if (valA < valB) return direccion === "asc" ? -1 : 1;
      if (valA > valB) return direccion === "asc" ? 1 : -1;
      return 0;
    }));
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    try {
      return new Date(fecha).toLocaleDateString("es-ES");
    } catch {
      return fecha;
    }
  };

  const formatearHora = (hora) => {
    if (!hora || typeof hora !== "string") return "N/A";
    return hora.length >= 5 ? hora.slice(0, 5) : hora;
  };

  const formatearMoneda = (valor) => {
    const num = Number(valor) || 0;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ventas realizados online</h1>
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar ventas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => ordenarVentas("nombreCliente")}
                    >
                      <div className="flex items-center">
                        Cliente
                        {orden.campo === "nombreCliente" && (
                          <svg
                            className={`ml-1 h-4 w-4 ${orden.direccion === "asc" ? "transform rotate-180" : ""}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => ordenarVentas("nombreProducto")}
                    >
                      <div className="flex items-center">
                        Producto
                        {orden.campo === "nombreProducto" && (
                          <svg
                            className={`ml-1 h-4 w-4 ${orden.direccion === "asc" ? "transform rotate-180" : ""}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => ordenarVentas("cantidad")}
                    >
                      <div className="flex items-center">
                        Cantidad
                        {orden.campo === "cantidad" && (
                          <svg
                            className={`ml-1 h-4 w-4 ${orden.direccion === "asc" ? "transform rotate-180" : ""}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => ordenarVentas("precioUnitario")}
                    >
                      <div className="flex items-center">
                        Precio Unit.
                        {orden.campo === "precioUnitario" && (
                          <svg
                            className={`ml-1 h-4 w-4 ${orden.direccion === "asc" ? "transform rotate-180" : ""}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => ordenarVentas("totalPago")}
                    >
                      <div className="flex items-center">
                        Total
                        {orden.campo === "totalPago" && (
                          <svg
                            className={`ml-1 h-4 w-4 ${orden.direccion === "asc" ? "transform rotate-180" : ""}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => ordenarVentas("metodoPago")}
                    >
                      <div className="flex items-center">
                        Pago
                        {orden.campo === "metodoPago" && (
                          <svg
                            className={`ml-1 h-4 w-4 ${orden.direccion === "asc" ? "transform rotate-180" : ""}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => ordenarVentas("fechaPago")}
                    >
                      <div className="flex items-center">
                        Fecha
                        {orden.campo === "fechaPago" && (
                          <svg
                            className={`ml-1 h-4 w-4 ${orden.direccion === "asc" ? "transform rotate-180" : ""}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => ordenarVentas("horaPago")}
                    >
                      <div className="flex items-center">
                        Hora
                        {orden.campo === "horaPago" && (
                          <svg
                            className={`ml-1 h-4 w-4 ${orden.direccion === "asc" ? "transform rotate-180" : ""}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ventasFiltradas.length > 0 ? (
                    ventasFiltradas.map((venta, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {venta?.nombreCliente || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {venta?.nombreProducto || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {venta?.cantidad || "0"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatearMoneda(venta?.precioUnitario)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-primary-600">
                            {formatearMoneda(venta?.totalPago)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            venta?.metodoPago === "Efectivo" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {venta?.metodoPago || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatearFecha(venta?.fechaPago)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatearHora(venta?.horaPago)}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                        No se encontraron ventas que coincidan con tu búsqueda
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVentasO;