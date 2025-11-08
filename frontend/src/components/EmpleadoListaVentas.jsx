import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient'; 
import { useAuthStore } from '../store/useAuthStore';
import Swal from 'sweetalert2';

// 1. Recibe la prop 'onEditar'
const EmpleadoListaVentas = ({ onVolver, endpoint, title, onEditar }) => {
  
  const { user } = useAuthStore();
  const permisos = user?.permisos || {};

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Lógica de Carga ---
  const cargarVentas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(endpoint);
      if (Array.isArray(response.data)) {
        setVentas(response.data);
      } else {
        setVentas([]);
      }
    } catch (err) {
      console.error("Error al cargar ventas:", err.response?.data || err.message);
      setError("No se pudieron cargar las ventas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, [endpoint]); 

  
  // --- Funciones de Botones ---
  const handleAnular = (idVentaE) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¡Vas a anular la venta #${idVentaE}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡anular!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.put(`/ventasEmpleados/anular/${idVentaE}`);
          Swal.fire('¡Anulada!', `La venta #${idVentaE} ha sido anulada.`, 'success');
          cargarVentas();
        } catch (err) {
          Swal.fire('Error', err.response?.data?.error || 'No se pudo anular.', 'error');
        }
      }
    });
  };

  const handleVerDetalle = async (idVentaE) => {
    Swal.fire({ title: 'Cargando detalle...', didOpen: () => Swal.showLoading() });
    try {
      const response = await apiClient.get(`/ventasEmpleados/detalle/${idVentaE}`);
      const detalles = response.data;
      let htmlDetalle = '<ul class="text-left list-disc list-inside mt-4">';
      detalles.forEach(prod => {
        htmlDetalle += `<li class="mb-2">(${prod.cantidad}x) <strong>${prod.nombreProducto}</strong> - $${prod.precioUnitario} c/u</li>`;
      });
      htmlDetalle += '</ul>';
      Swal.fire({ title: `Detalle de Venta #${idVentaE}`, html: htmlDetalle, icon: 'info' });
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'No se pudo cargar el detalle.', 'error');
    }
  };

  // 2. ¡Función 'handleEditar' actualizada!
  const handleEditar = (idVentaE) => {
    onEditar(idVentaE); // Llama a la prop del padre
  };


  // --- Renderizado Condicional ---
  const renderContenido = () => {
    if (loading) return <div className="text-center p-12 text-gray-500">Cargando ventas...</div>;
    if (error) return <div className="text-center p-12 text-red-600">{error}</div>;
    if (ventas.length === 0) return <div className="text-center p-12 text-gray-500">No se encontraron ventas.</div>;

    return (
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">Detalle</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Empleado</th>
              <th className="p-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
              <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">Estado</th>
              {permisos.modificar_ventasE && (
                <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ventas.map((venta) => (
              <tr key={venta.idVentaE} className={`hover:bg-gray-50 ${venta.estado === 'anulada' ? 'bg-red-50 opacity-60' : ''}`}>
                <td className="p-3 text-sm text-gray-700">#{venta.idVentaE}</td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => handleVerDetalle(venta.idVentaE)}
                    className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                    title="Ver detalle de productos"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
                <td className="p-3 text-sm text-gray-700">{venta.fechaPago} {venta.horaPago}</td>
                <td className="p-3 text-sm text-gray-700">{venta.nombreEmpleado}</td>
                <td className="p-3 text-sm text-gray-900 font-medium text-right">${venta.totalPago}</td>
                
                {/* --- ¡AQUÍ ESTÁ LA LÍNEA CORREGIDA! --- */}
                <td className="p-3 text-center">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      venta.estado === 'completada' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {venta.estado}
                  </span>
                </td>
                
                {permisos.modificar_ventasE && (
                  <td className="p-3 text-center text-sm">
                    {venta.estado === 'completada' ? (
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEditar(venta.idVentaE)}
                          className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-md text-xs font-medium hover:bg-yellow-500"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleAnular(venta.idVentaE)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-xs font-medium hover:bg-red-600"
                        >
                          Anular
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // --- Renderizado Principal ---
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <button 
            onClick={onVolver} 
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
            ⬅ Volver al Panel
        </button>
      </div>
      
      {renderContenido()}
    </div>
  );
};

export default EmpleadoListaVentas;