import { Link } from "react-router-dom";
import { ShoppingBag, Users } from "lucide-react"; // Opcional: Iconos más modernos si usas lucide, sino usa los SVG que tenías.

const OpcionesVentas = () => {
  return (
    <div className="p-10">
      <div className="max-w-7xl mx-auto relative flex items-center mb-10 px-6">

        {/* Título centrado real */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-4xl font-bold text-gray-800">
          ¿Qué desea ver?
        </h1>

        {/* Botón a la derecha */}
        <Link
          to="/admin"
          className="ml-auto flex items-center gap-2 px-4 py-2 
                     text-gray-600 hover:text-gray-900 transition"
        >
          ← Volver al panel
        </Link>
      </div>
      <nav className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Card Ventas Empleados */}
        <Link
          to="VentasE"
          className="block bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 border border-gray-100"
        >
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 p-5 rounded-full mb-4 shadow-sm">
              <svg className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-1 1v11a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm0 2a2 2 0 012 2v1H8V6a2 2 0 012-2zm0 8a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center">Ventas Empleados</h3>
            <p className="text-gray-500 text-center mt-2 text-sm">Gestionar ventas físicas</p>
          </div>
        </Link>

        {/* Card Ventas Online (Descomentada y mejorada) */}
        <Link
          to="VentasO"
          className="block bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 border border-gray-100"
        >
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-5 rounded-full mb-4 shadow-sm">
               {/* Cambié el color a azul/indigo para diferenciarlo visualmente, o usa el rojo que tenías */}
              <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center">Ventas Online</h3>
            <p className="text-gray-500 text-center mt-2 text-sm">Pedidos web y envíos</p>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default OpcionesVentas;