import { useEffect, useState } from "react";
import { getCliente } from "../store/useClienteStore";
import axios from "axios";

const MisCompras = () => {
  const [ventasAgrupadas, setVentasAgrupadas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const idCliente = await getCliente();
        const respuesta = await axios.get(
          `http://localhost:5000/ventaOnline/misCompras/${idCliente}`
        );
        const agrupadas = agruparVentas(respuesta.data.results);
        console.log(agrupadas)
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
        metodoPago,
        totalPago,
        nombreProducto,
        cantidad,
        precioUnitario,
      } = fila;

      if (!ventas[idVentaO]) {
        ventas[idVentaO] = {
          idVentaO,
          fechaPago,
          metodoPago,
          totalPago,
          productos: [],
        };
      }

      ventas[idVentaO].productos.push({
        nombreProducto,
        cantidad,
        precioUnitario,
      });
    });

    return Object.values(ventas);
  };

  if (cargando)
    return <p className="text-center mt-10">Cargando compras...</p>;

  if (ventasAgrupadas.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        Aún no tiene compras registradas.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Historial de Compras</h2>

      {ventasAgrupadas.map((venta) => (
        <div
          key={venta.idVentaO}
          className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm"
        >
          <div className="p-4 bg-gray-50 flex justify-between items-center rounded-t-xl">
            <div>
              <p className="font-semibold text-gray-700">
                Compra #{venta.idVentaO}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(venta.fechaPago).toLocaleDateString()} –{" "}
                {venta.metodoPago}
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-600 font-semibold">
                Total: ${venta.totalPago}
              </p>
              <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                Entregado
              </span>
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">Cantidad</th>
                  <th className="px-3 py-2">Precio Unitario</th>
                  <th className="px-3 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {venta.productos.map((prod, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-3 py-2">{prod.nombreProducto}</td>
                    <td className="px-3 py-2">{prod.cantidad}</td>
                    <td className="px-3 py-2">
                      ${prod.precioUnitario}
                    </td>
                    <td className="px-3 py-2">
                      ${(prod.cantidad * prod.precioUnitario)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MisCompras;
