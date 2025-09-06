import { useState, useEffect } from "react";
import axios from "axios";

const AdminVentasE = () => {
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [orden, setOrden] = useState({ campo: "fechaPago", direccion: "desc" });
  const [cargando, setCargando] = useState(true);

  const estadosPosibles = ["Pendiente", "Enviado", "Entregado", "Retirado", "Cancelado"];

  const obtenerVentas = async () => {
    try {
      setCargando(true);
      const res = await axios.get("http://localhost:5000/ventasOnline/todas");
      setVentas(res.data?.results || []);
      setVentasFiltradas(res.data?.results || []);
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
      const busqueda = filtro.toLowerCase();
      return (
        (venta.nombreEmpleado?.toLowerCase() || "").includes(busqueda) ||
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
      const valA = a[campo] || "";
      const valB = b[campo] || "";

      if (valA < valB) return direccion === "asc" ? -1 : 1;
      if (valA > valB) return direccion === "asc" ? 1 : -1;
      return 0;
    }));
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  const formatearHora = (hora) => {
    if (!hora || typeof hora !== "string") return "N/A";
    return hora.slice(0, 5);
  };

  const formatearMoneda = (valor) => {
    const num = Number(valor) || 0;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(num);
  };

  const handleEstadoChange = async (idVentaO, nuevoEstado) => {
    try {
      await axios.put("http://localhost:5000/ventaOnline/estado", {
        idVentaO,
        nuevoEstado,
      });
      setVentas((prev) =>
        prev.map((venta) =>
          venta.idVentaO === idVentaO ? { ...venta, estado: nuevoEstado } : venta
        )
      );
      setVentasFiltradas((prev) =>
        prev.map((venta) =>
          venta.idVentaO === idVentaO ? { ...venta, estado: nuevoEstado } : venta
        )
      );
    } catch (error) {
      alert("Error al actualizar el estado", error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ventas Realizadas por Empleados</h1>

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
                    {/* <Cabecera titulo="Empleado" campo="nombreEmpleado" ordenarVentas={ordenarVentas} orden={orden} /> */}
                    <Cabecera titulo="Producto" campo="nombreProducto" ordenarVentas={ordenarVentas} orden={orden} />
                    <Cabecera titulo="Cantidad" campo="cantidad" ordenarVentas={ordenarVentas} orden={orden} />
                    <Cabecera titulo="Precio Unit." campo="precioUnitario" ordenarVentas={ordenarVentas} orden={orden} />
                    <Cabecera titulo="Total" campo="totalPago" ordenarVentas={ordenarVentas} orden={orden} />
                    <Cabecera titulo="Pago" campo="metodoPago" ordenarVentas={ordenarVentas} orden={orden} />
                    <Cabecera titulo="Estado" campo="estado" ordenarVentas={ordenarVentas} orden={orden} />
                    <Cabecera titulo="Fecha" campo="fechaPago" ordenarVentas={ordenarVentas} orden={orden} />
                    <Cabecera titulo="Hora" campo="horaPago" ordenarVentas={ordenarVentas} orden={orden} />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ventasFiltradas.length > 0 ? (
                    ventasFiltradas.map((venta, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {/* PRODUCTO - achicado y truncado */}
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[120px] max-w-[180px] truncate">
                          {venta?.nombreProducto || "N/A"}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{venta?.cantidad || 0}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{formatearMoneda(venta?.precioUnitario)}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">{formatearMoneda(venta?.totalPago)}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            venta?.metodoPago === "Efectivo"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {venta?.metodoPago || "N/A"}
                          </span>
                        </td>
                        {/* NUEVA COLUMNA ESTADO */}
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          <select
                            className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                              venta?.estado === "Pendiente"
                                ? "bg-yellow-100 text-yellow-800"
                                : venta?.estado === "Enviado"
                                ? "bg-blue-100 text-blue-800"
                                : venta?.estado === "Entregado" || venta?.estado === "Retirado"
                                ? "bg-green-100 text-green-800"
                                : venta?.estado === "Cancelado"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                            value={venta?.estado || "Pendiente"}
                            onChange={(e) => handleEstadoChange(venta.idVentaO, e.target.value)}
                          >
                            {estadosPosibles.map((estado) => (
                              <option key={estado} value={estado}>
                                {estado}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{formatearFecha(venta?.fechaPago)}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{formatearHora(venta?.horaPago)}</td>
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

// Componente reutilizable para las cabeceras de tabla con orden
const Cabecera = ({ titulo, campo, ordenarVentas, orden }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
    onClick={() => ordenarVentas(campo)}
  >
    <div className="flex items-center">
      {titulo}
      {orden.campo === campo && (
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
);

export default AdminVentasE;
