import { Link } from "react-router-dom"

const OpcionesProductos = () => {
  return (
    <div className="mb-12">

      {/* HEADER */}
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

      {/* CARDS */}
      <nav className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 justify-items-center">
        
        <Link
          to="productos"
          className="w-full bg-white p-10 rounded-xl shadow-md 
                     hover:shadow-xl transform hover:scale-105 transition"
        >
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-6 rounded-full mb-6">
              <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Todos los productos
            </h3>
          </div>
        </Link>

        <Link
          to="ofertas"
          className="w-full bg-white p-10 rounded-xl shadow-md 
                     hover:shadow-xl transform hover:scale-105 transition"
        >
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 p-6 rounded-full mb-6">
              <svg className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Productos en Oferta
            </h3>
          </div>
        </Link>

      </nav>
    </div>
  )
}

export default OpcionesProductos
