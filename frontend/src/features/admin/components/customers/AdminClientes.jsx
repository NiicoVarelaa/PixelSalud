import { useState, useEffect } from "react";
import { useAuthStore } from "@store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { UserPlus } from "lucide-react";
import { AdminLayout } from "@features/admin/components/shared";

// Custom Hooks
import { useClientesData } from "./hooks/useClientesData";
import { useClientesFilters } from "./hooks/useClientesFilters";

// Components
import {
  StatsCards,
  ClientesFilters,
  ClienteCard,
  ClienteTable,
  ClientesPagination,
  ClienteModal,
  ConfirmDialog,
  LoadingState,
  EmptyState,
} from "./components";

/**
 * Componente principal de administración de clientes
 * Orquesta todos los sub-componentes y gestiona el estado global del módulo
 */
const AdminClientes = () => {
  const ITEMS_POR_PAGINA = 5;

  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Custom hooks
  const {
    clientes,
    cargando,
    estadisticas,
    crearCliente,
    actualizarCliente,
    cambiarEstadoCliente,
  } = useClientesData();

  const {
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    clientesFiltrados,
    clientesActuales,
  } = useClientesFilters(clientes, ITEMS_POR_PAGINA);

  // Estados del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

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
   * Abre el modal para crear un nuevo cliente
   */
  const handleCrearCliente = () => {
    setClienteEditando(null);
    setModalAbierto(true);
  };

  /**
   * Abre el modal para editar un cliente existente
   */
  const handleEditarCliente = (cliente) => {
    setClienteEditando(cliente);
    setModalAbierto(true);
  };

  /**
   * Guarda un cliente (creación o edición)
   */
  const handleGuardarCliente = async (datosCliente, idCliente) => {
    if (idCliente) {
      // Edición
      return await actualizarCliente(idCliente, datosCliente);
    } else {
      // Creación
      return await crearCliente(datosCliente);
    }
  };

  /**
   * Solicita confirmación para cambiar el estado de un cliente
   */
  const handleCambiarEstado = (cliente) => {
    const esActivo = cliente.activo !== 0 && cliente.activo !== false;

    setConfirmDialog({
      isOpen: true,
      title: esActivo ? "¿Desactivar Cliente?" : "¿Reactivar Cliente?",
      message: esActivo
        ? `El cliente ${cliente.nombreCliente} ${cliente.apellidoCliente} perderá acceso al sistema.`
        : `El cliente ${cliente.nombreCliente} ${cliente.apellidoCliente} recuperará acceso al sistema.`,
      type: esActivo ? "danger" : "info",
      confirmText: esActivo ? "Desactivar" : "Reactivar",
      action: () => cambiarEstadoCliente(cliente.idCliente, esActivo),
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
        title="Administración de Clientes"
        description="Gestiona los usuarios registrados en la farmacia"
        contentClassName="flex h-full min-h-0 flex-col gap-4"
        headerAction={
          <div className="flex gap-3">
            <button
              onClick={handleCrearCliente}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-green-700"
            >
              <UserPlus size={20} /> Nuevo Cliente
            </button>
            <Link
              to="/admin"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-300"
            >
              ← Volver
            </Link>
          </div>
        }
      >
        {/* Tarjetas de Estadísticas */}
        <StatsCards estadisticas={estadisticas} />

        {/* Filtros de Búsqueda */}
        <ClientesFilters
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          totalFiltrados={clientesFiltrados.length}
          totalClientes={clientes.length}
        />

        {/* Contenido Principal */}
        <div className="min-h-0 flex-1 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {cargando ? (
            <LoadingState />
          ) : clientesActuales.length === 0 ? (
            <EmptyState onCrearCliente={handleCrearCliente} />
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Vista Móvil - Cards */}
              <div className="lg:hidden overflow-y-auto p-4">
                {clientesActuales.map((cliente) => (
                  <ClienteCard
                    key={cliente.idCliente}
                    cliente={cliente}
                    onEditar={handleEditarCliente}
                    onCambiarEstado={handleCambiarEstado}
                  />
                ))}
              </div>

              {/* Vista Desktop - Tabla */}
              <div className="hidden min-h-0 flex-1 overflow-y-auto lg:block">
                <ClienteTable
                  clientes={clientesActuales}
                  onEditar={handleEditarCliente}
                  onCambiarEstado={handleCambiarEstado}
                />
              </div>

              <div className="mt-3 shrink-0 space-y-2 px-3 pb-3 sm:px-4 sm:pb-4">
                <p
                  className="text-xs font-medium text-gray-600"
                  aria-live="polite"
                >
                  Mostrando{" "}
                  {Math.min(
                    (paginaActual - 1) * ITEMS_POR_PAGINA + 1,
                    clientesFiltrados.length,
                  )}
                  -
                  {Math.min(
                    paginaActual * ITEMS_POR_PAGINA,
                    clientesFiltrados.length,
                  )}{" "}
                  de {clientesFiltrados.length} clientes
                </p>

                <ClientesPagination
                  paginaActual={paginaActual}
                  totalPaginas={totalPaginas}
                  onCambiarPagina={setPaginaActual}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal de Crear/Editar Cliente */}
        <ClienteModal
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onGuardar={handleGuardarCliente}
          clienteEditar={clienteEditando}
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

export default AdminClientes;
