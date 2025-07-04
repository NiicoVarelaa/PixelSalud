import { useEffect, useState } from "react";
import { getCliente } from "../store/useClienteStore";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaShoppingCart, FaCheckCircle } from "react-icons/fa";

const MisCompras = () => {
  const [ventasAgrupadas, setVentasAgrupadas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const ARSformatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const idCliente = await getCliente();
        const respuesta = await axios.get(
          `http://localhost:5000/ventaOnline/misCompras/${idCliente}`
        );
        const agrupadas = agruparVentas(respuesta.data.results);
        agrupadas.sort((a,b)=> b.idVentaO - a.idVentaO)
        setVentasAgrupadas(agrupadas)
        /* setVentasAgrupadas(agrupadas); */
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
          totalPago: Number(totalPago),
          productos: [],
        };
      }

      ventas[idVentaO].productos.push({
        nombreProducto,
        cantidad: Number(cantidad),
        precioUnitario: Number(precioUnitario),
      });
    });

    return Object.values(ventas);
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700 mb-4"></div>
            <p className="text-lg text-gray-700">Cargando tus compras...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (ventasAgrupadas.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <FaShoppingCart className="mx-auto h-16 w-16 text-secondary-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Aún no tienes compras registradas
            </h3>
            <p className="mt-2 text-gray-500">
              Cuando realices tu primera compra, aparecerá aquí tu historial.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-700 flex items-center gap-3">
              <FaShoppingCart className="text-primary-700" />
              Mis Compras
            </h1>
            <p className="mt-2 text-gray-600">
              Revisa el historial de todas tus compras realizadas.
            </p>
          </div>

          <div className="space-y-8">
            {ventasAgrupadas.map((venta) => (
              <div
                key={venta.idVentaO}
                className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-md border border-gray-200"
              >
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        Orden #{venta.idVentaO}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completado
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(venta.fechaPago).toLocaleDateString("es-AR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      • {venta.metodoPago}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase">Total:</p>
                    <p className="text-xl font-bold text-primary-700">
                      {ARSformatter.format(venta.totalPago)}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio Unitario
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {venta.productos.map((prod, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {prod.nombreProducto}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {prod.cantidad}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {ARSformatter.format(prod.precioUnitario)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {ARSformatter.format(
                                  prod.cantidad * prod.precioUnitario
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
