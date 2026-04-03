import { useState, useEffect } from "react";
import { useAuthStore } from "@store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ArrowLeft, UserPlus } from "lucide-react";
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
    <>
      <AdminLayout
        title="Administración de Empleados"
        description="Gestiona usuarios internos, accesos y permisos de manera centralizada"
        contentClassName="flex h-full min-h-0 flex-col gap-4"
        headerAction={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              onClick={handleCrearEmpleado}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white shadow-sm transition-colors hover:bg-green-700"
            >
              <UserPlus size={20} /> Agregar Empleado
            </button>
            <Link
              to="/admin"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <ArrowLeft size={18} /> Volver
            </Link>
          </div>
        }
      >
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
        <div className="flex min-h-0 flex-1 flex-col">
          {cargando ? (
            <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
              <LoadingState />
            </div>
          ) : empleadosActuales.length === 0 ? (
            <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
              <EmptyState onCrearEmpleado={handleCrearEmpleado} />
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Vista Móvil - Cards */}
                <div className="p-4 lg:hidden">
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
              </div>

              {/* Paginación */}
              <div className="mt-4 lg:mt-auto">
                <EmpleadosPagination
                  paginaActual={paginaActual}
                  totalPaginas={totalPaginas}
                  onCambiarPagina={setPaginaActual}
                />
              </div>
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

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminEmpleados;
