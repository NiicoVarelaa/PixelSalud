import { useCallback, useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Edit2, Loader2, X } from "lucide-react";
import PerfilEditForm from "@features/customer/components/profile/perfil/PerfilEditForm";
import PerfilReadView from "@features/customer/components/profile/perfil/PerfilReadView";
import {
  FIELD_CONFIG,
  PASSWORD_FIELDS,
} from "@features/customer/components/profile/perfil/perfilConfig";
import usePerfilForm from "@features/customer/hooks/usePerfilForm";

const Perfil = () => {
  const formId = useId();
  const formStatusId = `${formId}-status`;
  const editButtonRef = useRef(null);
  const firstFieldRef = useRef(null);

  const {
    user,
    isEditing,
    formData,
    loading,
    fetchLoading,
    successMsg,
    errorMsg,
    hasChanges,
    openEdit,
    cancelEdit,
    submitForm,
    handleInputChange,
  } = usePerfilForm();

  const handleCancel = useCallback(() => {
    const didCancel = cancelEdit();
    if (didCancel) {
      editButtonRef.current?.focus();
    }
  }, [cancelEdit]);

  const handleEditToggle = () => {
    if (isEditing) {
      handleCancel();
      return;
    }

    openEdit();
    requestAnimationFrame(() => firstFieldRef.current?.focus());
  };

  const handleSubmit = async (e) => {
    const didSubmit = await submitForm(e);
    if (didSubmit) {
      editButtonRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!isEditing) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        handleCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEditing, loading, handleCancel]);

  if (!user) return null;

  if (fetchLoading) {
    return (
      <div
        className="h-full flex items-center justify-center"
        aria-busy="true"
        aria-label="Cargando perfil"
      >
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2
            size={28}
            className="animate-spin text-primary-500"
            aria-hidden="true"
          />
          <p className="text-sm font-medium">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (errorMsg && !formData.nombreCliente) {
    return (
      <div
        role="alert"
        className="h-full flex items-center justify-center px-4"
      >
        <div className="text-center max-w-sm">
          <AlertCircle
            size={40}
            className="mx-auto text-red-400 mb-3"
            aria-hidden="true"
          />
          <p className="text-gray-700 font-semibold mb-1">Ocurrio un error</p>
          <p className="text-sm text-gray-400">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="h-full overflow-y-auto bg-gray-50 pt-4 pb-8"
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.04 }}
        className="mx-auto flex min-h-full max-w-4xl flex-col pb-4"
      >
        <motion.header
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.22, delay: 0.06 }}
          className="mb-4 shrink-0 sm:mb-5"
        >
          <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
            Mi cuenta
          </h2>
          <p  className="mt-1 text-sm text-gray-500">
            Gestiona tu informacion personal.
          </p>
        
        </motion.header>

        <main
          className="w-full"
          role="region"
          aria-label="Formulario de perfil"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.12 }}
              className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6 sm:py-5"
            >
              <div>
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  Informacion personal
                </h2>
                {isEditing && (
                  <p className="mt-0.5 text-xs text-gray-400">
                    Los campos marcados se actualizaran al guardar.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    aria-label="Cancelar edicion"
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none active:scale-95"
                  >
                    <X size={14} aria-hidden="true" />
                    <span className="hidden sm:inline">Cancelar</span>
                  </button>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  ref={editButtonRef}
                  type="button"
                  onClick={handleEditToggle}
                  aria-label={
                    isEditing ? "Cancelar edicion del perfil" : "Editar perfil"
                  }
                  aria-pressed={isEditing}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none active:scale-95 sm:px-4 ${
                    isEditing
                      ? "bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-400"
                      : "bg-primary-50 text-primary-700 hover:bg-primary-100 focus-visible:ring-primary-500"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X size={14} aria-hidden="true" />
                      <span className="hidden sm:inline">Cerrar</span>
                    </>
                  ) : (
                    <>
                      <Edit2 size={14} aria-hidden="true" />
                      <span>Editar</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            <div className="min-h-0 p-5 sm:p-6">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <PerfilEditForm
                    formId={formId}
                    formStatusId={formStatusId}
                    fields={FIELD_CONFIG}
                    passwordFields={PASSWORD_FIELDS}
                    formData={formData}
                    onChange={handleInputChange}
                    firstFieldRef={firstFieldRef}
                    loading={loading}
                    hasChanges={hasChanges}
                    successMsg={successMsg}
                    errorMsg={errorMsg}
                    onSubmit={handleSubmit}
                  />
                ) : (
                  <PerfilReadView formData={formData} successMsg={successMsg} />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>
      </motion.div>
    </motion.div>
  );
};

export default Perfil;
