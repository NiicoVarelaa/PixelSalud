import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../utils/apiClient'; 
import { useAuthStore } from '../store/useAuthStore';
import { Search, History, User, Calendar, Pill, Trash2, ArrowLeft, FileX, CheckCircle, AlertCircle } from 'lucide-react';

const MedicoMisRecetas = ({ onVolver }) => {
  const { user } = useAuthStore();
  
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 8; 

  const cargarRecetas = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/recetas/medico/${user.id}`);
      if (Array.isArray(response.data)) {
          console.log("Recetas cargadas:", response.data); // <--- MIRÁ ESTO EN CONSOLA (F12)
          setRecetas(response.data);
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo cargar el historial.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.id) cargarRecetas(); }, [user]);
  useEffect(() => { setPaginaActual(1); }, [busqueda]);

  const handleAnular = (idReceta) => {
    Swal.fire({
      title: '¿Anular Receta?',
      text: `La receta #${idReceta} dejará de ser válida.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Sí, Anular'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.put(`/recetas/baja/${idReceta}`);
          Swal.fire('Anulada', 'La receta se dio de baja.', 'success');
          cargarRecetas();
        } catch (error) {
          Swal.fire('Error', 'No se pudo anular.', 'error');
        }
      }
    });
  };

  const recetasFiltradas = recetas.filter((item) => {
    const termino = busqueda.toLowerCase();
    return (
        item.nombreCliente.toLowerCase().includes(termino) ||
        item.apellidoCliente.toLowerCase().includes(termino) ||
        item.nombreProducto.toLowerCase().includes(termino) ||
        item.idReceta.toString().includes(termino)
    );
  });

  const totalPaginas = Math.ceil(recetasFiltradas.length / itemsPorPagina);
  const recetasActuales = recetasFiltradas.slice(
      (paginaActual - 1) * itemsPorPagina, 
      paginaActual * itemsPorPagina
  );

  return (
    <div className="p-6 max-w-6xl mx-auto w-full animate-fadeIn">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <History className="text-green-600" /> Historial Médico
            </h1>
            <p className="text-gray-500 mt-1">Registro de recetas emitidas.</p>
        </div>
        <button onClick={onVolver} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 font-medium">
            <ArrowLeft size={18} /> Volver
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition bg-white"
                    placeholder="Buscar..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>
        </div>

        {loading ? (
            <div className="p-12 text-center text-gray-500">Cargando...</div>
        ) : recetasActuales.length === 0 ? (
            <div className="p-16 text-center text-gray-400">No se encontraron recetas.</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Paciente</th>
                            <th className="px-6 py-4">Medicamento</th>
                            <th className="px-6 py-4 text-center">Fecha</th>
                            <th className="px-6 py-4 text-center">Estado</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {recetasActuales.map((receta) => {
                            
                            // --- LÓGICA BLINDADA ---
                            // Convertimos a Número explícitamente (0 o 1)
                            const esActiva = Number(receta.activo) === 1;
                            const fueUsada = Number(receta.usada) === 1;

                            let estadoConfig = { color: 'bg-green-100 text-green-700', texto: 'Vigente', icon: <CheckCircle size={14}/> };
                            
                            if (fueUsada) {
                                estadoConfig = { color: 'bg-gray-100 text-gray-600', texto: 'Usada', icon: <History size={14}/> };
                            } else if (!esActiva) {
                                estadoConfig = { color: 'bg-red-50 text-red-600', texto: 'Anulada', icon: <AlertCircle size={14}/> };
                            }

                            return (
                                <tr key={receta.idReceta} className="hover:bg-green-50/30 transition-colors duration-150">
                                    <td className="px-6 py-4 font-mono text-sm text-gray-500">#{receta.idReceta}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800 text-sm">{receta.nombreCliente} {receta.apellidoCliente}</div>
                                        <div className="text-xs text-gray-500">DNI: {receta.dniCliente}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-700">{receta.nombreProducto}</span>
                                        <span className="text-gray-400 text-xs ml-1">(x{receta.cantidad})</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                                         {new Date(receta.fechaEmision).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${estadoConfig.color}`}>
                                            {estadoConfig.icon} {estadoConfig.texto}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {/* BOTÓN ANULAR: Solo si Activa=1 y Usada=0 */}
                                        {esActiva && !fueUsada ? (
                                            <button onClick={() => handleAnular(receta.idReceta)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Anular">
                                                <Trash2 size={18} />
                                            </button>
                                        ) : (
                                            <span className="text-gray-300 text-xs">--</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )}

        {/* Footer Paginación */}
        {totalPaginas > 1 && (
            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} disabled={paginaActual === 1} className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">Anterior</button>
                <span className="text-sm text-gray-600">Página {paginaActual} de {totalPaginas}</span>
                <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas} className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
            </div>
        )}

      </div>
    </div>
  );
};

export default MedicoMisRecetas;