import { AnimatePresence, motion } from "framer-motion";
import usePerfilDirecciones from "@features/customer/hooks/usePerfilDirecciones";
import {
  ARGENTINA,
  DireccionesErrorAlert,
  DireccionesForm,
  DireccionesHeader,
  DireccionesList,
  MAX_DIRECCIONES,
} from "@features/customer/components/profile/direcciones";

const PerfilDirecciones = () => {
  const {
    direcciones,
    form,
    error,
    loading,
    guardando,
    cupoCompleto,
    modoEdicion,
    mostrarFormulario,
    contador,
    isFormVisible,
    onChange,
    onSubmit,
    iniciarEdicion,
    cancelarEdicion,
    toggleFormularioNuevaDireccion,
    marcarPredeterminada,
    eliminarDireccion,
  } = usePerfilDirecciones();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="mx-auto flex h-full min-h-0 max-w-4xl flex-col gap-6 overflow-y-auto pt-4 pb-24 pr-1 md:pb-6"
    >
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.22 }}
        className="mb-1 shrink-0"
      >
        <DireccionesHeader
          maxDirecciones={MAX_DIRECCIONES}
          pais={ARGENTINA}
          contador={contador}
        />
      </motion.header>

      <AnimatePresence>
        <DireccionesErrorAlert message={error} />
      </AnimatePresence>

      <div className="grid gap-4">
        <DireccionesList
          loading={loading}
          direcciones={direcciones}
          onEditar={iniciarEdicion}
          onEliminar={eliminarDireccion}
          onMarcarPredeterminada={marcarPredeterminada}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggleFormularioNuevaDireccion}
          disabled={cupoCompleto && !modoEdicion}
          className={`flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
            mostrarFormulario && !modoEdicion
              ? "bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-500"
              : "bg-primary-50 text-primary-700 hover:bg-primary-100 focus-visible:ring-primary-500"
          }`}
        >
          {mostrarFormulario && !modoEdicion ? "Cancelar" : "Agregar direccion"}
        </button>
      </div>

      <AnimatePresence>
        <DireccionesForm
          isVisible={isFormVisible}
          modoEdicion={modoEdicion}
          form={form}
          cupoCompleto={cupoCompleto}
          guardando={guardando}
          loading={loading}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={cancelarEdicion}
        />
      </AnimatePresence>
    </motion.section>
  );
};

export default PerfilDirecciones;
