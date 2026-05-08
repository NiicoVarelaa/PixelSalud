import { useState, useEffect } from "react";
import { useAuthStore } from "@store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AdminLayout } from "@features/admin/components/shared";

import { useEmpleadosData } from "./hooks/useEmpleadosData";
import { useEmpleadosFilters } from "./hooks/useEmpleadosFilters";

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

const AdminEmpleados = () => {
  const ITEMS_POR_PAGINA = 7;

  const { user } = useAuthStore();
  const navigate = useNavigate();

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

  const [modalAbierto, setModalAbierto] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);

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

  const handleCrearEmpleado = () => {
    setEmpleadoEditando(null);
    setModalAbierto(true);
  };

  const handleEditarEmpleado = (empleado) => {
    setEmpleadoEditando(empleado);
    setModalAbierto(true);
  };

  const handleGuardarEmpleado = async (datosEmpleado, idEmpleado) => {
    if (idEmpleado) {
      const payload = { ...datosEmpleado };
      if (!payload.contraEmpleado?.trim()) {
        delete payload.contraEmpleado;
      }
      return await actualizarEmpleado(idEmpleado, payload);
    } else {
      return await crearEmpleado(datosEmpleado);
    }
  };

  const handleCambiarEstado = (empleado) => {
    const esActivo = empleado.activo !== 0 && empleado.activo !== false;

    setConfirmDialog({
      isOpen: true,
      title: esActivo ? "Desactivar Empleado" : "Reactivar Empleado",
      message: esActivo
        ? `El empleado ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado} perdera acceso al sistema.`
        : `El empleado ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado} recuperara acceso al sistema.`,
      type: esActivo ? "danger" : "info",
      confirmText: esActivo ? "Desactivar" : "Reactivar",
      action: () => cambiarEstadoEmpleado(empleado.idEmpleado, esActivo),
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
        title="Administracion de Empleados"
        description={`${empleadosFiltrados.length} empleado${empleadosFiltrados.length !== 1 ? "s" : ""} encontrado${empleadosFiltrados.length !== 1 ? "s" : ""}`}
      >
        <StatsCards estadisticas={estadisticas} />

        <div className="shrink-0">
          <EmpleadosFilters
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            totalFiltrados={empleadosFiltrados.length}
            totalEmpleados={empleados.length}
            onCrearEmpleado={handleCrearEmpleado}
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {cargando ? (
            <LoadingState />
          ) : empleadosActuales.length === 0 ? (
            <EmptyState onCrearEmpleado={handleCrearEmpleado} />
          ) : (
            <>
              <div className="lg:hidden space-y-2.5">
                {empleadosActuales.map((empleado) => (
                  <EmpleadoCard
                    key={empleado.idEmpleado}
                    empleado={empleado}
                    onEditar={handleEditarEmpleado}
                    onCambiarEstado={handleCambiarEstado}
                  />
                ))}
              </div>

              <div className="hidden lg:block">
                <EmpleadoTable
                  empleados={empleadosActuales}
                  onEditar={handleEditarEmpleado}
                  onCambiarEstado={handleCambiarEstado}
                />
              </div>
            </>
          )}
        </div>

        {empleadosFiltrados.length > 0 && (
          <div className="mt-3 shrink-0">
            <EmpleadosPagination
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onCambiarPagina={setPaginaActual}
            />
          </div>
        )}

        <EmpleadoModal
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onGuardar={handleGuardarEmpleado}
          empleadoEditar={empleadoEditando}
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

export default AdminEmpleados;
