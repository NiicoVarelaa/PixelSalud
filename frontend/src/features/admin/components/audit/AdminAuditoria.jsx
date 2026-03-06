import { useState, useEffect } from "react";
import {
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  FileText,
  Activity,
  AlertCircle,
} from "lucide-react";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";
import { PageHeader } from "@features/admin/components/shared";

const AdminAuditoria = () => {
  // Estado para las auditorías
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para filtros
  const [filtros, setFiltros] = useState({
    modulo: "",
    tipoUsuario: "",
    fechaDesde: "",
    fechaHasta: "",
    limite: 50,
    offset: 0,
  });

  // Estado para modal de detalles
  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Cargar auditorías
  useEffect(() => {
    cargarAuditorias();
  }, [filtros]);

  const cargarAuditorias = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filtros.modulo) params.append("modulo", filtros.modulo);
      if (filtros.tipoUsuario)
        params.append("tipoUsuario", filtros.tipoUsuario);
      if (filtros.fechaDesde) params.append("fechaDesde", filtros.fechaDesde);
      if (filtros.fechaHasta) params.append("fechaHasta", filtros.fechaHasta);
      params.append("limite", filtros.limite);
      params.append("offset", filtros.offset);

      const response = await apiClient.get(
        `/admin/auditoria?${params.toString()}`,
      );

      if (response.data.success) {
        setAuditorias(response.data.data);
      }
    } catch (error) {
      console.error("Error al cargar auditorías:", error);
      setError("No se pudieron cargar los registros de auditoría");
      toast.error("Error al cargar auditorías");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
      offset: 0, // Reset offset cuando cambian filtros
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      modulo: "",
      tipoUsuario: "",
      fechaDesde: "",
      fechaHasta: "",
      limite: 50,
      offset: 0,
    });
  };

  const verDetalles = (auditoria) => {
    setAuditoriaSeleccionada(auditoria);
    setMostrarModal(true);
  };

  const getEventoBadgeColor = (evento) => {
    if (evento.includes("EXITOSO") || evento.includes("CREADA"))
      return "bg-green-100 text-green-800";
    if (evento.includes("FALLIDO") || evento.includes("ERROR"))
      return "bg-red-100 text-red-800";
    if (evento.includes("MODIFICADO") || evento.includes("ACTUALIZADO"))
      return "bg-blue-100 text-blue-800";
    if (evento.includes("ELIMINADO") || evento.includes("CANCELADA"))
      return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  const getRolBadgeColor = (rol) => {
    const colores = {
      admin: "bg-purple-100 text-purple-800",
      empleado: "bg-blue-100 text-blue-800",
      medico: "bg-green-100 text-green-800",
      cliente: "bg-gray-100 text-gray-800",
      sistema: "bg-orange-100 text-orange-800",
    };
    return colores[rol] || "bg-gray-100 text-gray-800";
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <PageHeader
            title="Auditoría del Sistema"
            description="Registro completo de todas las acciones críticas del sistema"
          />
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Módulo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Módulo
              </label>
              <select
                value={filtros.modulo}
                onChange={(e) => handleFiltroChange("modulo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos</option>
                <option value="autenticacion">Autenticación</option>
                <option value="ventas">Ventas</option>
                <option value="productos">Productos</option>
                <option value="permisos">Permisos</option>
                <option value="usuarios">Usuarios</option>
                <option value="ofertas">Ofertas</option>
                <option value="mercadopago">MercadoPago</option>
              </select>
            </div>

            {/* Tipo Usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Usuario
              </label>
              <select
                value={filtros.tipoUsuario}
                onChange={(e) =>
                  handleFiltroChange("tipoUsuario", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos</option>
                <option value="admin">Admin</option>
                <option value="empleado">Empleado</option>
                <option value="medico">Médico</option>
                <option value="cliente">Cliente</option>
                <option value="sistema">Sistema</option>
              </select>
            </div>

            {/* Fecha Desde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desde
              </label>
              <input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) =>
                  handleFiltroChange("fechaDesde", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Fecha Hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hasta
              </label>
              <input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) =>
                  handleFiltroChange("fechaHasta", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar Filtros
            </button>
            <button
              onClick={cargarAuditorias}
              className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Módulo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Activity className="w-8 h-8 text-gray-400 animate-spin" />
                        <p className="text-gray-500">Cargando auditorías...</p>
                      </div>
                    </td>
                  </tr>
                ) : auditorias.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No se encontraron registros con los filtros aplicados
                      </p>
                    </td>
                  </tr>
                ) : (
                  auditorias.map((auditoria) => (
                    <tr
                      key={auditoria.idAuditoria}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatearFecha(auditoria.fechaHora)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getEventoBadgeColor(
                            auditoria.evento,
                          )}`}
                        >
                          {auditoria.evento.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {auditoria.modulo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {auditoria.nombreUsuario || "N/A"}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full w-fit mt-1 ${getRolBadgeColor(
                              auditoria.tipoUsuario,
                            )}`}
                          >
                            {auditoria.tipoUsuario}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {auditoria.descripcion || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => verDetalles(auditoria)}
                          className="text-primary-600 hover:text-primary-800 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {!loading && auditorias.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {auditorias.length} registros
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleFiltroChange(
                      "offset",
                      Math.max(0, filtros.offset - filtros.limite),
                    )
                  }
                  disabled={filtros.offset === 0}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() =>
                    handleFiltroChange(
                      "offset",
                      filtros.offset + filtros.limite,
                    )
                  }
                  disabled={auditorias.length < filtros.limite}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      {mostrarModal && auditoriaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Detalles de Auditoría
                </h3>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Información General */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Evento
                  </label>
                  <p className="mt-1 text-gray-900">
                    {auditoriaSeleccionada.evento.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Módulo
                  </label>
                  <p className="mt-1 text-gray-900 capitalize">
                    {auditoriaSeleccionada.modulo}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Acción
                  </label>
                  <p className="mt-1 text-gray-900">
                    {auditoriaSeleccionada.accion}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Fecha/Hora
                  </label>
                  <p className="mt-1 text-gray-900">
                    {formatearFecha(auditoriaSeleccionada.fechaHora)}
                  </p>
                </div>
              </div>

              {/* Usuario */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Usuario
                </label>
                <div className="mt-1 bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-900 font-medium">
                    {auditoriaSeleccionada.nombreUsuario || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {auditoriaSeleccionada.emailUsuario || "N/A"}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${getRolBadgeColor(
                      auditoriaSeleccionada.tipoUsuario,
                    )}`}
                  >
                    {auditoriaSeleccionada.tipoUsuario} #
                    {auditoriaSeleccionada.idUsuario}
                  </span>
                </div>
              </div>

              {/* Descripción */}
              {auditoriaSeleccionada.descripcion && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Descripción
                  </label>
                  <p className="mt-1 text-gray-900">
                    {auditoriaSeleccionada.descripcion}
                  </p>
                </div>
              )}

              {/* Entidad Afectada */}
              {auditoriaSeleccionada.entidadAfectada && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Entidad Afectada
                  </label>
                  <p className="mt-1 text-gray-900">
                    {auditoriaSeleccionada.entidadAfectada} #
                    {auditoriaSeleccionada.idEntidad}
                  </p>
                </div>
              )}

              {/* Datos Anteriores */}
              {auditoriaSeleccionada.datosAnteriores && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Datos Anteriores
                  </label>
                  <pre className="mt-1 bg-gray-50 rounded-lg p-3 text-xs overflow-x-auto">
                    {JSON.stringify(
                      auditoriaSeleccionada.datosAnteriores,
                      null,
                      2,
                    )}
                  </pre>
                </div>
              )}

              {/* Datos Nuevos */}
              {auditoriaSeleccionada.datosNuevos && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Datos Nuevos
                  </label>
                  <pre className="mt-1 bg-gray-50 rounded-lg p-3 text-xs overflow-x-auto">
                    {JSON.stringify(auditoriaSeleccionada.datosNuevos, null, 2)}
                  </pre>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Dirección IP
                  </label>
                  <p className="mt-1 text-gray-900 text-sm">
                    {auditoriaSeleccionada.ip || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    User Agent
                  </label>
                  <p className="mt-1 text-gray-900 text-sm truncate">
                    {auditoriaSeleccionada.userAgent || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={() => setMostrarModal(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditoria;
