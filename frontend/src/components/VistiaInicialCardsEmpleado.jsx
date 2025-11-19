import React from 'react';

const VistaInicialCardsEmpleado = ({ onNavegar, user }) => {
  
  const permisos = user?.permisos || {};

  // --- ¡EL ARREGLO! ---
  // Convertimos el valor a booleano real.
  // Esto chequea si es 1 (int) O si es true (bool). Si es 0, da false.
  const mostrarVentasTotales = permisos.ver_ventasTotalesE === 1 || permisos.ver_ventasTotalesE === true;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        Bienvenido, {user?.nombreEmpleado || user?.nombre || 'Empleado'}
      </h1>
      
      <p className="text-lg text-gray-600 text-center mt-2 mb-12">
        Selecciona qué deseas ver/hacer hoy
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Card 1: Realizar Venta */}
        <div 
          onClick={() => onNavegar('venta')}
          className="group p-8 bg-white rounded-xl shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-xl hover:bg-blue-50"
        >
          <span className="text-6xl">🛒</span>
          <h2 className="text-2xl font-semibold mt-4 text-gray-800 group-hover:text-blue-600">Realizar Venta</h2>
          <p className="text-gray-500 mt-1">Iniciar un nuevo ticket.</p>
        </div>

        {/* Card 2: Mis Ventas */}
        <div 
          onClick={() => onNavegar('misVentas')}
          className="group p-8 bg-white rounded-xl shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-xl hover:bg-green-50"
        >
          <span className="text-6xl">👤</span>
          <h2 className="text-2xl font-semibold mt-4 text-gray-800 group-hover:text-green-600">Mis Ventas</h2>
          <p className="text-gray-500 mt-1">Ver mi historial personal.</p>
        </div>

        {/* Card 3: Productos */}
        <div 
          onClick={() => onNavegar('productos')}
          className="group p-8 bg-white rounded-xl shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-xl hover:bg-yellow-50"
        >
          <span className="text-6xl">📦</span>
          <h2 className="text-2xl font-semibold mt-4 text-gray-800 group-hover:text-yellow-600">Productos</h2>
          <p className="text-gray-500 mt-1">Ver y gestionar stock.</p>
        </div>

        {/* Card 4: Ventas Totales */}
        {/* Usamos la variable booleana 'mostrarVentasTotales' en lugar del permiso directo */}
        {mostrarVentasTotales && (
            <div 
              onClick={() => onNavegar('ventasTotales')}
              className="group p-8 bg-white rounded-xl shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-xl hover:bg-purple-50"
            >
              <span className="text-6xl">📊</span>
              <h2 className="text-2xl font-semibold mt-4 text-gray-800 group-hover:text-purple-600">Ventas Totales</h2>
              <p className="text-gray-500 mt-1">Ver ventas de todos.</p>
            </div>
        )}
        
      </div>
    </div>
  );
};

export default VistaInicialCardsEmpleado;