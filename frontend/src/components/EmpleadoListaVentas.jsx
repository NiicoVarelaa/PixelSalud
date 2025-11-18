import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient'; 
import { useAuthStore } from '../store/useAuthStore';
import Swal from 'sweetalert2';
import { Search, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react'; // Importamos iconos

const EmpleadoListaVentas = ({ onVolver, endpoint, title, onEditar }) => {
  
  const { user } = useAuthStore();
  const permisos = user?.permisos || {};

  // --- Estados de Datos ---
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Estados de Paginación y Búsqueda ---
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

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

  // Resetear a página 1 cuando se busca
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);


  // =================================================================
  // --- LÓGICA DE FILTRADO Y PAGINACIÓN ---
  // =================================================================
  
  // 1. Filtrar ventas
  const ventasFiltradas = ventas.filter((venta) => {
    const termino = busqueda.toLowerCase();
    // Convertimos todo a string por si acaso
    const id = venta.idVentaE?.toString() || '';
    const empleado = venta.nombreEmpleado?.toLowerCase() || '';
    const estado = venta.estado?.toLowerCase() || '';
    const metodo = venta.metodoPago?.toLowerCase() || '';

    return (
        id.includes(termino) ||
        empleado.includes(termino) ||
        estado.includes(termino) ||
        metodo.includes(termino)
    );
  });

  // 2. Calcular Paginación
  const totalPaginas = Math.ceil(ventasFiltradas.length / itemsPorPagina);
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const ventasActuales = ventasFiltradas.slice(indicePrimerItem, indiceUltimoItem);


  // =================================================================
  // --- FUNCIONES DE ACCIÓN (Handlers) ---
  // =================================================================

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
    Swal.fire({ title: 'Cargando detalle...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const response = await apiClient.get(`/ventasEmpleados/detalle/${idVentaE}`);
      const detalles = response.data;
      const totalCalculado = detalles.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);

      let rowsHtml = '';
      detalles.forEach(prod => {
        const subtotal = prod.cantidad * prod.precioUnitario;
        rowsHtml += `
            <tr class="border-b border-gray-100 last:border-0">
                <td class="px-4 py-3 text-left font-medium text-gray-700 whitespace-normal break-words max-w-[250px]">
                    ${prod.nombreProducto}
                </td>
                <td class="px-4 py-3 text-center text-gray-600 align-top">${prod.cantidad}</td>
                <td class="px-4 py-3 text-right text-gray-500 align-top whitespace-nowrap">$${prod.precioUnitario}</td>
                <td class="px-4 py-3 text-right font-bold text-gray-800 align-top whitespace-nowrap">$${subtotal}</td>
            </tr>
        `;
      });

      Swal.fire({
        title: `<div class="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">🧾 Ticket #${idVentaE}</div>`,
        html: `
            <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <table class="min-w-full text-sm">
                    <thead class="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th class="px-4 py-3 text-left w-5/12">Producto</th>
                            <th class="px-4 py-3 text-center w-2/12">Cant.</th>
                            <th class="px-4 py-3 text-right w-2/12">P. Unit</th>
                            <th class="px-4 py-3 text-right w-3/12">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">${rowsHtml}</tbody>
                    <tfoot class="bg-blue-50">
                        <tr>
                            <td colspan="3" class="px-4 py-3 text-right font-bold text-gray-600 uppercase text-xs">Total Final:</td>
                            <td class="px-4 py-3 text-right font-bold text-blue-700 text-lg">$${totalCalculado}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `,
        width: '700px',
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#3B82F6',
        focusConfirm: true
      });
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'No se pudo cargar el detalle.', 'error');
    }
  };

  const handleEditar = (idVentaE) => {
    onEditar(idVentaE);
  };


  // =================================================================
  // --- RENDERIZADO ---
  // =================================================================

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full animate-fadeIn">
      
      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <button onClick={onVolver} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            ⬅ Volver al Panel
        </button>
      </div>

      {/* ESTADOS DE CARGA/ERROR */}
      {loading && <div className="text-center p-12 text-gray-500">Cargando ventas...</div>}
      {error && <div className="text-center p-12 text-red-600">{error}</div>}
      
      {!loading && !error && (
        <>
            {/* BARRA DE BÚSQUEDA */}
            <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/2 md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Buscar por ID, Empleado o Estado..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {/* TABLA */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
                <table className="min-w-full w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Detalle</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Empleado</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Estado</th>
                        {permisos.modificar_ventasE && (
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {ventasActuales.length > 0 ? (
                        ventasActuales.map((venta) => (
                        <tr key={venta.idVentaE} className={`hover:bg-gray-50 transition ${venta.estado === 'anulada' ? 'bg-red-50 opacity-70' : ''}`}>
                            <td className="px-4 py-3 text-sm text-gray-700 font-mono">#{venta.idVentaE}</td>
                            <td className="px-4 py-3 text-center">
                                <button 
                                    onClick={() => handleVerDetalle(venta.idVentaE)}
                                    className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                                    title="Ver detalle"
                                >
                                    <Eye size={16} />
                                </button>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                {new Date(venta.fechaPago).toLocaleDateString()} <span className="text-gray-400 text-xs">{venta.horaPago}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 font-medium">{venta.nombreEmpleado}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-bold text-right">${venta.totalPago}</td>
                            <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    venta.estado === 'completada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {venta.estado}
                                </span>
                            </td>
                            
                            {/* Acciones (Solo con permiso) */}
                            {permisos.modificar_ventasE && (
                                <td className="px-4 py-3 text-center text-sm">
                                    {venta.estado === 'completada' ? (
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => handleEditar(venta.idVentaE)}
                                            className="p-1.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                                            title="Editar"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleAnular(venta.idVentaE)}
                                            className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                                            title="Anular"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    ) : (
                                    <span className="text-xs text-gray-400 italic">Sin acciones</span>
                                    )}
                                </td>
                            )}
                        </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" className="p-8 text-center text-gray-500">No se encontraron ventas.</td></tr>
                    )}
                </tbody>
                </table>
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPaginas > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-600">
                        Página {paginaActual} de {totalPaginas} ({ventasFiltradas.length} ventas)
                    </span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                            disabled={paginaActual === 1}
                            className="p-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                            disabled={paginaActual === totalPaginas}
                            className="p-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default EmpleadoListaVentas;