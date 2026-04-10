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
  const ITEMS_POR_PAGINA = 6;

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
    empleadosFiltrados,
    empleadosActuales,
  } = useEmpleadosFilters(empleados, ITEMS_POR_PAGINA);

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
          <div className="flex gap-3">
            <button
              onClick={handleCrearEmpleado}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-green-700"
            >
              <UserPlus size={20} /> Nuevo Empleado
            </button>
            <Link
              to="/admin"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-300"
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
          totalFiltrados={empleadosFiltrados.length}
          totalEmpleados={empleados.length}
        />

        {/* Contenido Principal */}
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {cargando ? (
            <LoadingState />
          ) : empleadosActuales.length === 0 ? (
            <EmptyState onCrearEmpleado={handleCrearEmpleado} />
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Vista Móvil - Cards */}
              <div className="min-h-0 flex-1 overflow-y-auto p-4 lg:hidden">
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
              <div className="hidden min-h-0 flex-1 overflow-auto lg:block">
                <EmpleadoTable
                  empleados={empleadosActuales}
                  onEditar={handleEditarEmpleado}
                  onCambiarEstado={handleCambiarEstado}
                />
              </div>

              {empleadosFiltrados.length > 0 && (
                <div className="mt-3 shrink-0 space-y-2 px-3 pb-3 sm:px-4 sm:pb-4">
                  <p
                    className="text-xs font-medium text-gray-600"
                    aria-live="polite"
                  >
                    Mostrando{" "}
                    {Math.min(
                      (paginaActual - 1) * ITEMS_POR_PAGINA + 1,
                      empleadosFiltrados.length,
                    )}
                    -
                    {Math.min(
                      paginaActual * ITEMS_POR_PAGINA,
                      empleadosFiltrados.length,
                    )}{" "}
                    de {empleadosFiltrados.length} empleados
                  </p>

                  <EmpleadosPagination
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onCambiarPagina={setPaginaActual}
                  />
                </div>
              )}
            </div>
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
