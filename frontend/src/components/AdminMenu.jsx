import { Link } from "react-router-dom";

const AdminMenu = () => {
  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Bienvenido Admin
        </h1>
      </div>

      <br />

      {/* Se agregó un espacio más en el grid para el nuevo módulo (lg:grid-cols-5) */}
      <nav className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Card de Mensajes */}
        

        <Link
          to="/admin/MenuProductos"
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-5 rounded-full mb-4">
              <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 2 2 2 0 000-2H7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Productos</h3>
          </div>
        </Link>

        <Link
          to="/admin/MenuClientes"
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-5 rounded-full mb-4">
              <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Clientes</h3>
          </div>
        </Link>

        <Link
          to="/admin/MenuEmpleados"
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 p-5 rounded-full mb-4">
              <svg className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Empleados</h3>
          </div>
        </Link>
        
        {/* NUEVA CARD PARA MÉDICOS */}
        <Link
          to="/admin/MenuMedicosAdmin"
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-5 rounded-full mb-4">
              {/* Icono de Cruz Médica / Salud */}
              <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">Médicos</h3>
          </div>
        </Link>
        
        <Link
          to="/admin/MenuVentas"
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 p-5 rounded-full mb-4">
              {/* Icono: Currency Dollar (Símbolo de moneda) */}
              <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">Ventas</h3>
          </div>
        </Link>

        <Link
          to="/admin/mensajes"
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-cyan-100 p-5 rounded-full mb-4">
              {/* Icono de sobre */}
              <svg className="h-12 w-12 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a3 3 0 003.22 0L22 8m-19 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">Mensajes</h3>
          </div>
        </Link>

      </nav>
    </>
  );
};

export default AdminMenu;