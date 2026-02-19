import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import {
  FaEnvelopeOpen,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaFilter,
  FaSearch,
  FaReply,
  FaTrash,
  FaArchive,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

// Formateador nativo para fechas tipo dd/MM/yyyy HH:mm
function formatFecha(fechaStr) {
  if (!fechaStr) return "-";
  const fecha = new Date(fechaStr);
  if (isNaN(fecha)) return "-";
  const pad = (n) => n.toString().padStart(2, "0");
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
  const [modalResponder, setModalResponder] = useState(false);
  const [respuesta, setRespuesta] = useState("");

  useEffect(() => {
    fetchMensajes();
  }, []);

  const fetchMensajes = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/mensajes");
      setMensajes(res.data);
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
      toast.error("Error al cargar mensajes");
      setMensajes([]);
    }
    setLoading(false);
  };

  const marcarLeido = async (idMensaje) => {
    try {
      await apiClient.patch(`/mensajes/${idMensaje}/leido`);
      toast.success("Mensaje marcado como leído");
      fetchMensajes();
    } catch (error) {
      console.error("Error al marcar como leído:", error);
      toast.error("Error al marcar como leído");
    }
  };

  const cambiarEstado = async (idMensaje, nuevoEstado) => {
    try {
      await apiClient.put(`/mensajes/${idMensaje}/estado`, {
        estado: nuevoEstado,
      });
      toast.success("Estado actualizado correctamente");
      fetchMensajes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al cambiar estado");
    }
  };

  const eliminarMensaje = async (idMensaje) => {
    const result = await Swal.fire({
      title: "¿Eliminar mensaje?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/mensajes/${idMensaje}`);
        toast.success("Mensaje eliminado correctamente");
        fetchMensajes();
        if (mensajeSeleccionado?.idMensaje === idMensaje) {
          setMensajeSeleccionado(null);
        }
      } catch (error) {
        console.error("Error al eliminar mensaje:", error);
        toast.error("Error al eliminar mensaje");
      }
    }
  };

  const abrirModalResponder = (mensaje) => {
    setMensajeSeleccionado(mensaje);
    setModalResponder(true);
    setRespuesta("");
  };

  const enviarRespuesta = async () => {
    if (!respuesta.trim()) {
      toast.warning("La respuesta no puede estar vacía");
      return;
    }

    try {
      await apiClient.post(
        `/mensajes/${mensajeSeleccionado.idMensaje}/responder`,
        {
          respuesta: respuesta.trim(),
        },
      );
      toast.success("Respuesta enviada correctamente");
      setModalResponder(false);
      setRespuesta("");
      setMensajeSeleccionado(null);
      fetchMensajes();
    } catch (error) {
      console.error("Error al responder:", error);
      toast.error("Error al enviar respuesta");
    }
  };

  const mensajesFiltrados = mensajes.filter((m) => {
    if (filtro !== "todos" && m.estado !== filtro) return false;
    if (
      busqueda &&
      !(
        m.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.asunto?.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.mensaje?.toLowerCase().includes(busqueda.toLowerCase())
      )
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* HEADER: Título y Botón Volver alineados */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-primary-700">
            Gestión de Mensajes
          </h1>

          <Link
            to="/admin"
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer font-medium"
          >
            ← Volver
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex gap-2 items-center">
            <FaFilter className="text-gray-400" />
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
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
              onChange={(e) => setBusqueda(e.target.value)}
              className="outline-none text-sm bg-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  Leído
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  Asunto
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    Cargando...
                  </td>
                </tr>
              ) : mensajesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No hay mensajes
                  </td>
                </tr>
              ) : (
                mensajesFiltrados.map((m) => (
                  <tr
                    key={m.idMensaje}
                    className={m.leido ? "bg-white" : "bg-primary-50"}
                  >
                    <td className="px-4 py-2 text-center">
                      {m.leido ? (
                        <FaEnvelopeOpen className="text-green-500 mx-auto" />
                      ) : (
                        <FaEnvelope className="text-primary-600 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`text-xs px-2 py-1 rounded font-semibold ${m.estado === "nuevo" ? "bg-primary-100 text-primary-700" : m.estado === "en_proceso" ? "bg-yellow-100 text-yellow-700" : m.estado === "respondido" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"}`}
                      >
                        {estadoLabels[m.estado] || m.estado}
                      </span>
                    </td>
                    <td className="px-4 py-2">{m.nombre}</td>
                    <td className="px-4 py-2">{m.email}</td>
                    <td className="px-4 py-2">{m.asunto}</td>
                    <td className="px-4 py-2">{formatFecha(m.fechaEnvio)}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1 items-center flex-wrap">
                        <button
                          className="text-xs px-2 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1"
                          onClick={() => setMensajeSeleccionado(m)}
                          title="Ver detalle"
                        >
                          <FaEnvelopeOpen size={10} /> Ver
                        </button>
                        {m.estado !== "respondido" &&
                          m.estado !== "cerrado" && (
                            <button
                              className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
                              onClick={() => abrirModalResponder(m)}
                              title="Responder"
                            >
                              <FaReply size={10} /> Responder
                            </button>
                          )}
                        {m.estado !== "cerrado" && (
                          <button
                            className="text-xs px-2 py-1 rounded bg-gray-400 text-white hover:bg-gray-500 flex items-center gap-1"
                            onClick={() =>
                              cambiarEstado(m.idMensaje, "cerrado")
                            }
                            title="Archivar"
                          >
                            <FaArchive size={10} />
                          </button>
                        )}
                        <button
                          className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
                          onClick={() => eliminarMensaje(m.idMensaje)}
                          title="Eliminar"
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de detalle */}
        {mensajeSeleccionado && !modalResponder && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setMensajeSeleccionado(null)}
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>

              {/* Header */}
              <h2 className="text-2xl font-bold mb-4 text-primary-700 flex items-center gap-2">
                <FaEnvelope className="text-primary-600" /> Mensaje de{" "}
                {mensajeSeleccionado.nombre}
              </h2>

              {/* Info del mensaje */}
              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="font-semibold text-gray-600">Email:</span>{" "}
                  <span className="text-gray-800">
                    {mensajeSeleccionado.email}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-600">Asunto:</span>{" "}
                  <span className="text-gray-800">
                    {mensajeSeleccionado.asunto}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-600">Fecha:</span>{" "}
                  <span className="text-gray-800">
                    {formatFecha(mensajeSeleccionado.fechaEnvio)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-600">Estado:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      mensajeSeleccionado.estado === "nuevo"
                        ? "bg-primary-100 text-primary-700"
                        : mensajeSeleccionado.estado === "en_proceso"
                          ? "bg-yellow-100 text-yellow-700"
                          : mensajeSeleccionado.estado === "respondido"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {estadoLabels[mensajeSeleccionado.estado] ||
                      mensajeSeleccionado.estado}
                  </span>
                </div>
              </div>

              {/* Mensaje del cliente */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Mensaje:</h3>
                <div className="p-4 bg-gray-50 rounded border border-gray-200 text-gray-800 whitespace-pre-line">
                  {mensajeSeleccionado.mensaje}
                </div>
              </div>

              {/* Respuesta del admin (si existe) */}
              {mensajeSeleccionado.respuesta && (
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                    <FaReply /> Respuesta:
                  </h3>
                  <div className="p-4 bg-blue-50 rounded border border-blue-200 text-gray-800 whitespace-pre-line">
                    {mensajeSeleccionado.respuesta}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Respondido por:{" "}
                    {mensajeSeleccionado.respondidoPor || "Admin"} •{" "}
                    {formatFecha(mensajeSeleccionado.fechaRespuesta)}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-3 justify-end mt-6 flex-wrap">
                {!mensajeSeleccionado.leido && (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                    onClick={() => {
                      marcarLeido(mensajeSeleccionado.idMensaje);
                      setMensajeSeleccionado(null);
                    }}
                  >
                    <FaCheck /> Marcar como leído
                  </button>
                )}
                {mensajeSeleccionado.estado !== "respondido" &&
                  mensajeSeleccionado.estado !== "cerrado" && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                      onClick={() => {
                        setModalResponder(true);
                      }}
                    >
                      <FaReply /> Responder
                    </button>
                  )}
                {mensajeSeleccionado.estado !== "cerrado" && (
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex items-center gap-2"
                    onClick={() => {
                      cambiarEstado(mensajeSeleccionado.idMensaje, "cerrado");
                      setMensajeSeleccionado(null);
                    }}
                  >
                    <FaArchive /> Archivar
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
                  onClick={() => {
                    eliminarMensaje(mensajeSeleccionado.idMensaje);
                  }}
                >
                  <FaTrash /> Eliminar
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                  onClick={() => setMensajeSeleccionado(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de responder */}
        {modalResponder && mensajeSeleccionado && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => {
                  setModalResponder(false);
                  setRespuesta("");
                }}
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                <FaReply /> Responder mensaje
              </h2>

              {/* Contexto del mensaje original */}
              <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                <div className="text-sm mb-2">
                  <span className="font-semibold">De:</span>{" "}
                  {mensajeSeleccionado.nombre} ({mensajeSeleccionado.email})
                </div>
                <div className="text-sm mb-2">
                  <span className="font-semibold">Asunto:</span>{" "}
                  {mensajeSeleccionado.asunto}
                </div>
                <div className="text-xs text-gray-600 italic line-clamp-3">
                  {mensajeSeleccionado.mensaje}
                </div>
              </div>

              {/* Campo de respuesta */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tu respuesta:
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded p-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Escribe tu respuesta aquí..."
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {respuesta.length} caracteres
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 justify-end">
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                  onClick={() => {
                    setModalResponder(false);
                    setRespuesta("");
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                  onClick={enviarRespuesta}
                  disabled={!respuesta.trim()}
                >
                  <FaReply /> Enviar respuesta
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default AdminMensajes;
