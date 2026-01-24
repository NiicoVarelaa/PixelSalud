import { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelopeOpen, FaEnvelope, FaCheck, FaTimes, FaFilter, FaSearch } from "react-icons/fa";

// Formateador nativo para fechas tipo dd/MM/yyyy HH:mm
function formatFecha(fechaStr) {
  if (!fechaStr) return '-';
  const fecha = new Date(fechaStr);
  if (isNaN(fecha)) return '-';
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(fecha.getDate())}/${pad(fecha.getMonth() + 1)}/${fecha.getFullYear()} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
}


const estadoLabels = {
  nuevo: "Nuevo",
  en_proceso: "En proceso",
  respondido: "Respondido",
  cerrado: "Cerrado",
};

const AdminMensajes = () => {
  const [mensajes, setMensajes] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMensajes();
  }, []);

  const fetchMensajes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/mensajes");
      setMensajes(res.data);
    } catch {
      setMensajes([]);
    }
    setLoading(false);
  };

  const marcarLeido = async (idMensaje) => {
    await axios.patch(`http://localhost:5000/mensajes/${idMensaje}/leido`);
    fetchMensajes();
  };

  const cambiarEstado = async (idMensaje, nuevoEstado) => {
    await axios.patch(`http://localhost:5000/mensajes/${idMensaje}/estado`, { estado: nuevoEstado });
    fetchMensajes();
  };

  const mensajesFiltrados = mensajes.filter((m) => {
    if (filtro !== "todos" && m.estado !== filtro) return false;
    if (busqueda && !(
      m.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.asunto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.mensaje?.toLowerCase().includes(busqueda.toLowerCase())
    )) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-primary-700">Gestión de Mensajes</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex gap-2 items-center">
            <FaFilter className="text-gray-400" />
            <select
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="todos">Todos</option>
              <option value="nuevo">Nuevos</option>
              <option value="en_proceso">En proceso</option>
              <option value="respondido">Respondidos</option>
              <option value="cerrado">Cerrados</option>
            </select>
          </div>
          <div className="flex items-center border rounded px-2 py-1 bg-white">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, asunto o mensaje..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="outline-none text-sm bg-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Leído</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Asunto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8">Cargando...</td></tr>
              ) : mensajesFiltrados.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No hay mensajes</td></tr>
              ) : (
                mensajesFiltrados.map((m) => (
                  <tr key={m.idMensaje} className={m.leido ? "bg-white" : "bg-primary-50"}>
                    <td className="px-4 py-2 text-center">
                      {m.leido ? <FaEnvelopeOpen className="text-green-500 mx-auto" /> : <FaEnvelope className="text-primary-600 mx-auto" />}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${m.estado === 'nuevo' ? 'bg-primary-100 text-primary-700' : m.estado === 'en_proceso' ? 'bg-yellow-100 text-yellow-700' : m.estado === 'respondido' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>{estadoLabels[m.estado] || m.estado}</span>
                    </td>
                    <td className="px-4 py-2">{m.nombre}</td>
                    <td className="px-4 py-2">{m.email}</td>
                    <td className="px-4 py-2">{m.asunto}</td>
                    <td className="px-4 py-2">{formatFecha(m.fechaEnvio)}</td>
                    <td className="px-4 py-2 flex gap-2 items-center">
                      <button
                        className="text-xs px-2 py-1 rounded bg-primary-600 text-white hover:bg-primary-700"
                        onClick={() => setMensajeSeleccionado(m)}
                      >Ver</button>
                      {!m.leido && (
                        <button
                          className="text-xs px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                          onClick={() => marcarLeido(m.idMensaje)}
                        >Marcar leído</button>
                      )}
                      {m.estado !== 'cerrado' && (
                        <button
                          className="text-xs px-2 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                          onClick={() => cambiarEstado(m.idMensaje, 'cerrado')}
                        >Cerrar</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de detalle */}
        {mensajeSeleccionado && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setMensajeSeleccionado(null)}
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-primary-700 flex items-center gap-2">
                <FaEnvelope className="text-primary-600" /> Mensaje de {mensajeSeleccionado.nombre}
              </h2>
              <div className="mb-2 text-sm text-gray-500">{mensajeSeleccionado.email}</div>
              <div className="mb-2 text-sm text-gray-500">Asunto: <span className="font-semibold text-gray-700">{mensajeSeleccionado.asunto}</span></div>
              <div className="mb-2 text-sm text-gray-500">Fecha: {formatFecha(mensajeSeleccionado.fechaEnvio)}</div>
              <div className="my-6 p-4 bg-gray-50 rounded border border-gray-100 text-gray-800 whitespace-pre-line">
                {mensajeSeleccionado.mensaje}
              </div>
              <div className="flex gap-3 justify-end mt-4">
                {!mensajeSeleccionado.leido && (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => { marcarLeido(mensajeSeleccionado.idMensaje); setMensajeSeleccionado(null); }}
                  >Marcar como leído</button>
                )}
                {mensajeSeleccionado.estado !== 'cerrado' && (
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => { cambiarEstado(mensajeSeleccionado.idMensaje, 'cerrado'); setMensajeSeleccionado(null); }}
                  >Cerrar mensaje</button>
                )}
                <button
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                  onClick={() => setMensajeSeleccionado(null)}
                >Cerrar ventana</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMensajes;
