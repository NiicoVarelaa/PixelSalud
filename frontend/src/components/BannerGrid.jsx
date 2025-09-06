import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importa Link de react-router-dom
import axios from "axios";
import wp from '../assets/iconos/whatsapp.png'

const BannerGrid = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/productos");
        const productosMezclados = response.data.sort(
          () => 0.5 - Math.random()
        );
        const productosSeleccionados = productosMezclados.slice(0, 6);
        setProductos(productosSeleccionados);
      } catch (error) {
        console.error("Error al obtener los productos:", error);        
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="bg-gray-50 py-8">
      {/* Removed 'container mx-auto' to make the content full width */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          
        <div className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2 lg:col-span-2 flex flex-col lg:flex-row">
          <div className="p-8 flex-1">
            <div
              className="text-white py-1 px-3 rounded-full text-xs font-semibold inline-block mb-4 bg-secondary-400"
            >
              NUEVO
            </div>
            <h2
              className="text-3xl font-bold mb-3 text-primary-700"
            >
              RESERVÁ TUS MEDICAMENTOS
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Y RETIRALOS SIN HACER FILA
            </p>
            <Link
              to="/Error404"
              className="inline-block text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 cursor-pointer bg-primary-700"
            >
              MÁS INFORMACIÓN
            </Link>
          </div>
          <div
            className="flex items-center justify-center p-4 lg:w-1/3 bg-primary-100"
          >
            <svg
              className="h-32 w-32 text-secondary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <div
              className="text-white p-2 rounded-full w-10 h-10 flex items-center justify-center mb-4 bg-secondary-400"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              CONSULTA EN
            </h3>
            <p className="text-gray-600 mb-2">MOSTRADOR DE FARMACIA</p>
            <p
              className="font-bold text-sm text-primary-700"
            >
              POR DESCUENTOS DE HASTA
            </p>
            <div
              className="font-extrabold text-5xl my-3 text-primary-700"
            >
              40%
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-xs uppercase tracking-wide">
                EXCLUSIVO
              </p>
              <p className="font-semibold text-secondary-400">
                Pixel Salud
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden lg:row-span-2 flex flex-col">
          <div className="p-8 flex flex-col items-center justify-center flex-1">
            <div
              className="text-white rounded-full p-4 mb-4 "
            >
              <img src={wp} className="h-12 w-12" alt="Whatsapp" />
            </div>
            <h3
              className="text-2xl font-bold mb-2 text-center text-primary-700"
            >
              ¿Necesitas ayuda?
            </h3>
            <p className="text-gray-700 text-lg text-center mb-6">
              ¡Tu Salud es Nuestra Prioridad! Chateá con Nuestros Expertos Ahora.
            </p>
            <Link
              to="/Error404"
              className="inline-block text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 cursor-pointer bg-primary-700"
            >
              CHATEAR POR WHATSAPP
            </Link>
          </div>
        </div>

        {/* Sabías qué */}
        <div
          className="rounded-xl shadow-md overflow-hidden md:col-span-2 bg-primary-700"
        >
          <div className="p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">¿SABÍAS QUÉ?</h3>
            <p className="text-white text-lg font-medium mb-6">
              PODÉS COMPRAR ONLINE TUS MEDICAMENTOS DE VENTA LIBRE Y
              RETIRARLOS EN TU SUCURSAL MÁS CERCANA
            </p>
            <Link
              to="/Error404"
              className="inline-block text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 cursor-pointer bg-secondary-400"
            >
              BUSCAR SUCURSAL
            </Link>
          </div>
        </div>

        {/* Widget Checkerboard */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2 lg:col-span-1">
          <div className="grid grid-cols-2 h-full">
            <div
              className="p-4 flex flex-col items-center justify-center bg-secondary-400"
            >
              <svg
                className="h-8 w-8 text-white mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-white font-bold text-center">
                PROMOCIONES EXCLUSIVAS
              </p>
            </div>
            <div
              className="p-4 flex flex-col items-center justify-center bg-primary-700"
            >
              <svg
                className="h-8 w-8 text-white mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              <p className="text-white font-bold text-center">
                DESCUENTOS POR NUBE
              </p>
            </div>
          </div>
        </div>

        {/* Banner con productos de la DB */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2 lg:col-span-4">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Del 28 al 30 de Junio
                </h3>
                <p className="text-gray-600 font-bold text-lg">
                  OFERTAS
                </p>
              </div>
              <Link
                to="/productos"
                className="mt-4 md:mt-0 bg-secondary-400 hover:bg-secondary-500 text-white font-bold py-2 px-6 rounded-full text-sm transition duration-300 cursor-pointer"
              >
                VER TODOS LOS PRODUCTOS
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {productos.map((producto) => (
                <Link
                  key={producto.idProducto}
                  to={`/productos/${producto.idProducto}`}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-between hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
                >
                  <div
                    className="absolute top-2 right-2 bg-secondary-400 hover:bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full"                    
                  >
                    ¡OFERTA!
                  </div>
                  <img
                    src={producto.img}
                    alt={producto.nombreProducto}
                    className="h-24 w-24 rounded-full object-cover mb-3"
                  />
                  <div className="w-full text-center">
                    <p className="text-gray-700 text-sm font-medium truncate mb-1">
                      {producto.nombreProducto}
                    </p>
                    <p
                      className="font-bold text-md text-primary-700"
                    >
                      {producto.precio && !isNaN(parseFloat(producto.precio))
                        ? `$${parseFloat(producto.precio).toFixed(2)}`
                        : "Precio no disponible"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerGrid;