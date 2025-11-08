import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient'; // Tu cliente Axios
import { useAuthStore } from '../store/useAuthStore'; // Tu store de Zustand
import Swal from 'sweetalert2';

// Recibe props del padre (PanelEmpleados)
const EmpleadoListaVentas = ({ onVolver, endpoint, title }) => {
  
  // 1. Obtenemos el usuario y sus permisos del store
  const { user } = useAuthStore();
  // Creamos un objeto 'permisos' seguro, aunque venga nulo
  const permisos = user?.permisos || {};

  // 2. Estados locales para manejar la data
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Función para cargar las ventas (reutilizable)
  const cargarVentas = async () => {
    setLoading(true);
    setError(null);
    try {
      // Usamos el 'endpoint' que nos pasó el padre
      const response = await apiClient.get(endpoint);
      
      // El backend puede devolver {msg: "..."} si no hay ventas (según tu código anterior)
      if (Array.isArray(response.data)) {
        setVentas(response.data);
      } else {
        setVentas([]); // Si no es un array, lo dejamos vacío
      }
    } catch (err) {
      console.error("Error al cargar ventas:", err.response?.data || err.message);
      setError("No se pudieron cargar las ventas. Revisa tu conexión o permisos.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Carga inicial de datos cuando el componente se monta
  useEffect(() => {
    cargarVentas();
  }, [endpoint]); // Se ejecuta cada vez que el 'endpoint' cambie

  
  // --- Funciones de Botones ---

  // 5. Función para ANULAR (solo se llama si el botón es visible)
  const handleAnular = (idVentaE) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¡Vas a anular la venta #${idVentaE}! Esta acción devolverá el stock y no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡anular!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Ruta: PUT /ventasEmpleados/anular/:idVentaE
          await apiClient.put(`/ventasEmpleados/anular/${idVentaE}`);
          Swal.fire(
            '¡Anulada!',
            `La venta #${idVentaE} ha sido anulada.`,
            'success'
          );
          // Recargamos la lista para ver el estado actualizado
          cargarVentas();
        } catch (err) {
          Swal.fire(
            'Error',
            err.response?.data?.error || 'No se pudo anular la venta.',
            'error'
          );
        }
      }
    });
  };

  // 6. Función para EDITAR (placeholder por ahora)
  const handleEditar = (idVentaE) => {
    // TODO: Esto debería abrir un modal o una nueva vista con el formulario de edición
    Swal.fire({
      title: 'Editar Venta (En Desarrollo)',
      text: `Aquí se abriría el formulario para editar la venta #${idVentaE}.`,
      icon: 'info'
    });
  };

  // --- Renderizado Condicional de Contenido ---

  const renderContenido = () => {
    if (loading) {
      return <div className="text-center p-12 text-gray-500">Cargando ventas...</div>;
    }
    if (error) {
      return <div className="text-center p-12 text-red-600">{error}</div>;
    }
    if (ventas.length === 0) {
      return <div className="text-center p-12 text-gray-500">No se encontraron ventas para esta vista.</div>;
    }

    // ¡Mostramos la tabla!
    return (
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Venta</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha y Hora</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Empleado</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
              
              {/* === [PERMISOS] === Mostramos la columna SÓLO si tiene el permiso */}
              {permisos.modificar_ventasE && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ventas.map((venta) => (
              <tr key={venta.idVentaE} className={`hover:bg-gray-50 ${venta.estado === 'anulada' ? 'bg-red-50 opacity-60' : ''}`}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">#{venta.idVentaE}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{venta.fechaPago} {venta.horaPago}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{venta.nombreEmpleado}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium text-right">${venta.totalPago}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      venta.estado === 'completada' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {venta.estado}
                  </span>
                </td>
                
                {/* === [PERMISOS] === Mostramos los botones SÓLO si tiene el permiso */}
                {permisos.modificar_ventasE && (
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    {/* Y SÓLO si la venta NO está anulada */}
                    {venta.estado === 'completada' ? (
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEditar(venta.idVentaE)}
                          className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-md text-xs font-medium hover:bg-yellow-500 transition"
                          title="Editar Venta"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleAnular(venta.idVentaE)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-xs font-medium hover:bg-red-600 transition"
                          title="Anular Venta"
                        >
                          Anular
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span> // Si ya está anulada, no hay acciones
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

  // --- Renderizado Principal del Componente ---
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
      
      {/* Aquí renderizamos la tabla (o el loading/error) */}
      {renderContenido()}
    </div>
  );
};

export default EmpleadoListaVentas;