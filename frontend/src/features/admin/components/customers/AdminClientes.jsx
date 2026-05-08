import { useState, useEffect } from "react";
import { useAuthStore } from "@store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AdminLayout } from "@features/admin/components/shared";

import { useClientesData } from "./hooks/useClientesData";
import { useClientesFilters } from "./hooks/useClientesFilters";

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

const AdminClientes = () => {
  const ITEMS_POR_PAGINA = 7;

  const { user } = useAuthStore();
  const navigate = useNavigate();

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

  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
    action: null,
  });

  useEffect(() => {
    if (!user || user.rol !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleCrearCliente = () => {
    setClienteEditando(null);
    setModalAbierto(true);
  };

  const handleEditarCliente = (cliente) => {
    setClienteEditando(cliente);
    setModalAbierto(true);
  };

  const handleGuardarCliente = async (datosCliente, idCliente) => {
    if (idCliente) {
      return await actualizarCliente(idCliente, datosCliente);
    } else {
      return await crearCliente(datosCliente);
    }
  };

  const handleCambiarEstado = (cliente) => {
    const esActivo = cliente.activo !== 0 && cliente.activo !== false;

    setConfirmDialog({
      isOpen: true,
      title: esActivo ? "Desactivar Cliente" : "Reactivar Cliente",
      message: esActivo
        ? `El cliente ${cliente.nombreCliente} ${cliente.apellidoCliente} perdera acceso al sistema.`
        : `El cliente ${cliente.nombreCliente} ${cliente.apellidoCliente} recuperara acceso al sistema.`,
      type: esActivo ? "danger" : "info",
      confirmText: esActivo ? "Desactivar" : "Reactivar",
      action: () => cambiarEstadoCliente(cliente.idCliente, esActivo),
    });
  };

  const handleConfirmarAccion = async () => {
    if (confirmDialog.action) {
      await confirmDialog.action();
    }
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  return (
    <>
      <AdminLayout
        title="Administracion de Clientes"
        description={`${clientesFiltrados.length} cliente${clientesFiltrados.length !== 1 ? "s" : ""} encontrado${clientesFiltrados.length !== 1 ? "s" : ""}`}
      >
        <StatsCards estadisticas={estadisticas} />

        <div className="mb-4 lg:mb-4 shrink-0">
          <ClientesFilters
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            totalFiltrados={clientesFiltrados.length}
            totalClientes={clientes.length}
            onCrearCliente={handleCrearCliente}
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {cargando ? (
            <LoadingState />
          ) : clientesActuales.length === 0 ? (
            <EmptyState onCrearCliente={handleCrearCliente} />
          ) : (
            <>
              <div className="lg:hidden space-y-2.5">
                {clientesActuales.map((cliente) => (
                  <ClienteCard
                    key={cliente.idCliente}
                    cliente={cliente}
                    onEditar={handleEditarCliente}
                    onCambiarEstado={handleCambiarEstado}
                  />
                ))}
              </div>

              <div className="mb-4 lg:mb-8 hidden lg:block">
                <ClienteTable
                  clientes={clientesActuales}
                  onEditar={handleEditarCliente}
                  onCambiarEstado={handleCambiarEstado}
                />
              </div>
            </>
          )}
        </div>

        {clientesFiltrados.length > 0 && (
          <div className=" shrink-0">
            <ClientesPagination
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onCambiarPagina={setPaginaActual}
            />
          </div>
        )}

        <ClienteModal
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onGuardar={handleGuardarCliente}
          clienteEditar={clienteEditando}
        />

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
