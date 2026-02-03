import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; // 1. Importamos el Store

const VistaInicialCardsEmpleado = () => { // 2. Ya no esperamos recibir 'user' por props
  
  const navigate = useNavigate();
  const { user } = useAuthStore(); // 3. Sacamos el usuario del estado global
  const permisos = user?.permisos || {};

  // Lógica para el botón de Ventas Totales
  const mostrarVentasTotales = permisos.ver_ventasTotalesE === 1 || permisos.ver_ventasTotalesE === true;

  return (
    <div className="flex flex-col items-center justify-start min-h-full bg-gray-50/50 p-6 pt-24 animate-fadeIn">
      
      {/* Título */}
      <h1 className="text-5xl font-extrabold text-gray-800 text-center tracking-tight">
        Bienvenido, <span className="text-blue-600">{user?.nombre || 'Empleado'}</span>
      </h1>
      
      <p className="text-xl text-gray-500 text-center mt-4 mb-16 font-light">
        Selecciona una opción para comenzar tu jornada
      </p>
      
      <div className="flex flex-wrap justify-center gap-10 w-full max-w-6xl">
        
        {/* Card 1: Realizar Venta */}
        <div 
          onClick={() => navigate('venta')}
          className="group w-72 p-8 bg-white rounded-3xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 flex flex-col items-center text-center"
        >
          <div className="p-4 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-600 transition-colors duration-300">
             <span className="text-5xl group-hover:text-white transition-colors">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Realizar Venta</h2>
          <p className="text-gray-500 mt-2 text-sm">Iniciar un nuevo ticket de venta para un cliente.</p>
        </div>

        {/* Card 2: Mis Ventas */}
        <div 
          onClick={() => navigate('misventas')} 
          className="group w-72 p-8 bg-white rounded-3xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-green-200 flex flex-col items-center text-center"
        >
          <div className="p-4 bg-green-50 rounded-full mb-4 group-hover:bg-green-600 transition-colors duration-300">
             <span className="text-5xl group-hover:text-white transition-colors">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">Mis Ventas</h2>
          <p className="text-gray-500 mt-2 text-sm">Ver mi historial personal y comisiones.</p>
        </div>

        {/* Card 3: Productos */}
        <div 
          onClick={() => navigate('productos')} 
          className="group w-72 p-8 bg-white rounded-3xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-yellow-200 flex flex-col items-center text-center"
        >
          <div className="p-4 bg-yellow-50 rounded-full mb-4 group-hover:bg-yellow-500 transition-colors duration-300">
             <span className="text-5xl group-hover:text-white transition-colors">📦</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">Productos</h2>
          <p className="text-gray-500 mt-2 text-sm">Consultar stock, precios y ofertas disponibles.</p>
        </div>

        {/* Card 4: Ventas Totales */}
        {mostrarVentasTotales && (
            <div 
              onClick={() => navigate('ventastotales')} 
              className="group w-72 p-8 bg-white rounded-3xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-purple-200 flex flex-col items-center text-center"
            >
              <div className="p-4 bg-purple-50 rounded-full mb-4 group-hover:bg-purple-600 transition-colors duration-300">
                 <span className="text-5xl group-hover:text-white transition-colors">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Ventas Totales</h2>
              <p className="text-gray-500 mt-2 text-sm">Auditoría general de ventas de la farmacia.</p>
            </div>
        )}
        
      </div>
    </div>
  );
};

export default VistaInicialCardsEmpleado;