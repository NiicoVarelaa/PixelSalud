import { useState, useEffect } from "react";
import { useAuthStore } from "@store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { UserPlus } from "lucide-react";
import { AdminLayout } from "@features/admin/components/shared";

// Custom Hooks
import { useEmpleadosData } from "./hooks/useEmpleadosData";
import { useEmpleadosFilters } from "./hooks/useEmpleadosFilters";

// Components
import {
  StatsCards,
  EmpleadosFilters,
  EmpleadoCard,
  EmpleadoTable,
  EmpleadosPagination,
  EmpleadoModal,
  ConfirmDialog,
  LoadingState,
  EmptyState,
} from "./components";

/**
 * Componente principal de administración de empleados
 * Orquesta todos los sub-componentes y gestiona el estado global del módulo
 */
const AdminEmpleados = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Custom hooks
  const {
    empleados,
    cargando,
    estadisticas,
    crearEmpleado,
    actualizarEmpleado,
    cambiarEstadoEmpleado,
  } = useEmpleadosData();

  const {
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    empleadosActuales,
  } = useEmpleadosFilters(empleados, 8);

  // Estados del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);

  // Estados del diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
    action: null,
  });

  // Protección de ruta - solo admin
  useEffect(() => {
    if (!user || user.rol !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  /**
   * Abre el modal para crear un nuevo empleado
   */
  const handleCrearEmpleado = () => {
    setEmpleadoEditando(null);
    setModalAbierto(true);
  };

  /**
   * Abre el modal para editar un empleado existente
   */
  const handleEditarEmpleado = (empleado) => {
    setEmpleadoEditando(empleado);
    setModalAbierto(true);
  };

  /**
   * Guarda un empleado (creación o edición)
   */
  const handleGuardarEmpleado = async (datosEmpleado, idEmpleado) => {
    if (idEmpleado) {
      // Edición
      return await actualizarEmpleado(idEmpleado, datosEmpleado);
    } else {
      // Creación
      return await crearEmpleado(datosEmpleado);
    }
  };

  /**
   * Solicita confirmación para cambiar el estado de un empleado
   */
  const handleCambiarEstado = (empleado) => {
    const esActivo = empleado.activo !== 0 && empleado.activo !== false;

    setConfirmDialog({
      isOpen: true,
      title: esActivo ? "¿Dar de Baja?" : "¿Reactivar Empleado?",
      message: esActivo
        ? `El empleado ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado} perderá acceso al sistema.`
        : `El empleado ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado} recuperará acceso al sistema.`,
      type: esActivo ? "danger" : "info",
      confirmText: esActivo ? "Dar de Baja" : "Reactivar",
      action: () => cambiarEstadoEmpleado(empleado.idEmpleado, esActivo),
    });
  };

  /**
   * Ejecuta la acción del diálogo de confirmación
   */
  const handleConfirmarAccion = async () => {
    if (confirmDialog.action) {
      await confirmDialog.action();
    }
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  return (
    <AdminLayout
      title="Administración de Empleados"
      description="Gestiona el acceso y permisos del personal"
      headerAction={
        <div className="flex gap-3">
          <button
            onClick={handleCrearEmpleado}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
          >
            <UserPlus size={20} /> Agregar Empleado
          </button>
          <Link
            to="/admin"
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer font-medium"
          >
            ← Volver
          </Link>
        </div>
      }
    >
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Tarjetas de Estadísticas */}
      <StatsCards estadisticas={estadisticas} />

      {/* Filtros de Búsqueda */}
      <EmpleadosFilters
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
      />

      {/* Contenido Principal */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        {cargando ? (
          <LoadingState />
        ) : empleadosActuales.length === 0 ? (
          <EmptyState onCrearEmpleado={handleCrearEmpleado} />
        ) : (
          <>
            {/* Vista Móvil - Cards */}
            <div className="lg:hidden p-4">
              {empleadosActuales.map((empleado) => (
                <EmpleadoCard
                  key={empleado.idEmpleado}
                  empleado={empleado}
                  onEditar={handleEditarEmpleado}
                  onCambiarEstado={handleCambiarEstado}
                />
              ))}
            </div>

            {/* Vista Desktop - Tabla */}
            <EmpleadoTable
              empleados={empleadosActuales}
              onEditar={handleEditarEmpleado}
              onCambiarEstado={handleCambiarEstado}
            />

            {/* Paginación */}
            <EmpleadosPagination
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onCambiarPagina={setPaginaActual}
            />
          </>
        )}
      </div>

      {/* Modal de Crear/Editar Empleado */}
      <EmpleadoModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGuardar={handleGuardarEmpleado}
        empleadoEditar={empleadoEditando}
      />

      {/* Diálogo de Confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={handleConfirmarAccion}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText={confirmDialog.confirmText}
      />
    </AdminLayout>
  );
};

export default AdminEmpleados;
