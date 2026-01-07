import { Link } from "react-router-dom"

const OpcionesVentas = () => {
  return (
    <div>
      <nav className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Link
          to="VentasE"
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 p-5 rounded-full mb-4">
              <svg className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-1 1v11a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm0 2a2 2 0 012 2v1H8V6a2 2 0 012-2zm0 8a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">Ventas Empleados</h3>
          </div>
        </Link>{/* 

        <Link
          to="ventasO"
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-5 rounded-full mb-4">
              <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2-3-.895-3-2M12 8V6m0 12v-2m0-6h.01M6 12h.01M18 12h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">Ventas Online</h3>
          </div>
        </Link> */}
      </nav>
    </div>
  )
}

export default OpcionesVentas