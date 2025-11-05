import { Link } from "react-router-dom";

const MedicosMenu = () => {
  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Bienvenido Doctor
        </h1>
        <p className="text-lg text-gray-600">
          Que quiere hacer?
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-10">

        
        <Link
          to="/PanelMedicos/Receta"
         
          className="w-130 bg-white p-12 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-5 rounded-full mb-4">
             
              <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Recetas</h3>
          </div>
        </Link>

        
        <Link
          to="/PanelMedicos/CrearReceta"
         
          className="w-130 bg-white p-12 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-5 rounded-full mb-4">
    
              <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Crear Receta</h3>
          </div>
        </Link>

      </div> 
    </>
  );
};

export default MedicosMenu;