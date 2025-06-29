
import { useState, useEffect } from "react";
import axios from "axios";

const AdminVentasO = () => {
  const [ventas, setVentas] = useState([]);

  const obtenerVentas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/todas");
      setVentas(res.data.results); // 👈 porque estás usando `res.status(200).json({ message, results })`
    } catch (error) {
      console.error("Error al obtener las ventas", error);
    }
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Lista de Ventas
      </h2>

      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3">Precio Unitario</th>
              <th className="px-4 py-3">Total Venta</th>
              <th className="px-4 py-3">Método de Pago</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Hora</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{venta.nombreCliente}</td>
                <td className="px-4 py-2">{venta.nombreProducto}</td>
                <td className="px-4 py-2">{venta.cantidad}</td>
                <td className="px-4 py-2">${venta.precioUnitario}</td>
                <td className="px-4 py-2">${venta.totalPago}</td>
                <td className="px-4 py-2">{venta.metodoPago}</td>
                <td className="px-4 py-2">{venta.fechaPago}</td>
                <td className="px-4 py-2">{venta.horaPago}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVentasO;