import { Link } from "react-router-dom"

const OpcionesProductos = () => {
  return (
    <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Que desea ver?
        </h1>
        <br />
        <nav className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">

        
        <Link
          to="productos" 
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-5 rounded-full mb-4">
          
              <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">Todos los productos</h3>
          </div>
        </Link>

        
        <Link
          to="ofertas" 
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 p-5 rounded-full mb-4">
              
              <svg className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">Productos en Oferta</h3>
          </div>
        </Link>

        
        <Link
          to="productosActivos" 
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-5 rounded-full mb-4">
              
              <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">Productos Activos</h3>
          </div>
        </Link>

       
        <Link
          to="productosBaja" 
          className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-5 rounded-full mb-4">
              
              <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">Productos de Baja</h3>
          </div>
        </Link>

      </nav>
    </div>
  )
}

export default OpcionesProductos