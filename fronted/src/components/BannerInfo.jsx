import { Link } from 'react-router-dom';

const BannerInfo = () => {
  // Define your primary color for consistency
  const primaryColor = "#00a339"; // Verde

  return (
    <div className="bg-gray-50 py-6"> {/* Background and padding for the entire bar */}
      {/* Removed 'container mx-auto px-4' to make it full width */}
      <div className="flex flex-col md:flex-row justify-around items-center bg-white rounded-xl shadow-md p-6 space-y-6 md:space-y-0 md:space-x-4">
          
        {/* Cómo comprar? Section */}
        <div className="flex items-center space-x-3 w-full md:w-1/3">
          <div 
            className="p-3 rounded-full flex-shrink-0" 
            style={{ backgroundColor: 'rgba(0, 163, 57, 0.1)' }} // Lighter primary for background
          >
            {/* Shopping Bag Icon (Tailwind CSS Heroicons equivalent) */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ color: primaryColor }} // Primary color for icon
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">¿Cómo comprar?</p>
            <Link to="/Error404" className="text-sm font-medium hover:underline" style={{ color: primaryColor }}>
              Enterate acá <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Separator for medium and larger screens */}
        <div className="hidden md:block border-l border-gray-200 h-16"></div>

        {/* Medios de pago Section */}
        <div className="flex items-center space-x-3 w-full md:w-1/3">
          <div 
            className="p-3 rounded-full flex-shrink-0" 
            style={{ backgroundColor: 'rgba(0, 163, 57, 0.1)' }} // Lighter primary for background
          >
            {/* Credit Card Icon (Tailwind CSS Heroicons equivalent) */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ color: primaryColor }} // Primary color for icon
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Medios de pago</p>
            <Link to="/Error404" className="text-sm font-medium hover:underline" style={{ color: primaryColor }}>
              Ver más <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Separator for medium and larger screens */}
        <div className="hidden md:block border-l border-gray-200 h-16"></div>

        {/* Retirá tu pedido gratis Section */}
        <div className="flex items-center space-x-3 w-full md:w-1/3">
          <div 
            className="p-3 rounded-full flex-shrink-0" 
            style={{ backgroundColor: 'rgba(0, 163, 57, 0.1)' }} // Lighter primary for background
          >
            {/* Calendar/Delivery Icon (Tailwind CSS Heroicons equivalent) */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ color: primaryColor }} // Primary color for icon
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Retirá tu pedido gratis</p>
            <Link to="/Error404" className="text-sm font-medium hover:underline" style={{ color: primaryColor }}>
              Ver puntos <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BannerInfo;