import { Link } from 'react-router-dom';

const BannerInfo = () => {
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-around items-center bg-white rounded-xl shadow-md p-6 space-y-6 md:space-y-0 md:space-x-4">
        <div className="flex flex-col items-center text-center space-y-3 w-full md:w-1/3"> 
          <div 
            className="p-3 rounded-full flex-shrink-0 bg-primary-100" 
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-primary-700" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">¿Cómo comprar?</p>
            <Link to="/Error404" className="text-sm font-medium hover:underline text-primary-700">
              Enterate acá <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="hidden md:block border-l border-gray-200 h-16"></div>
        <div className="flex flex-col items-center text-center space-y-3 w-full md:w-1/3">
          <div 
            className="p-3 rounded-full flex-shrink-0 bg-primary-100" 
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-primary-700" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Medios de pago</p>
            <Link to="/Error404" className="text-sm font-medium hover:underline text-primary-700">
              Ver más <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="hidden md:block border-l border-gray-200 h-16"></div>
        <div className="flex flex-col items-center text-center space-y-3 w-full md:w-1/3">
          <div 
            className="p-3 rounded-full flex-shrink-0 bg-primary-100"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-primary-700" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Retirá tu pedido gratis</p>
            <Link to="/Error404" className="text-sm font-medium hover:underline text-primary-700">
              Ver puntos <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BannerInfo;