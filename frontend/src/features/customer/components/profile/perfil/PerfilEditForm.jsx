import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import PerfilFormField from "./PerfilFormField";
import PerfilToast from "./PerfilToast";

const PerfilEditForm = ({
  formId,
  formStatusId,
  fields,
  passwordFields,
  formData,
  onChange,
  firstFieldRef,
  loading,
  hasChanges,
  successMsg,
  errorMsg,
  onSubmit,
}) => {
  return (
    <motion.form
      key="form"
      id={formId}
      noValidate
      onSubmit={onSubmit}
      aria-label="Formulario de edición del perfil"
      aria-describedby={formStatusId}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 gap-4"
    >
      {fields.map((field) => (
        <PerfilFormField
          key={field.key}
          field={field}
          value={formData[field.key]}
          onChange={onChange}
          formId={formId}
          inputRef={field.key === "nombreCliente" ? firstFieldRef : null}
          disabled={loading}
          describedBy={formStatusId}
        />
      ))}

      {passwordFields.map((field) => (
        <PerfilFormField
          key={field.key}
          field={field}
          value={formData[field.key]}
          onChange={onChange}
          formId={formId}
          disabled={loading}
          describedBy={formStatusId}
        />
      ))}

      <div id={formStatusId} className="flex flex-col gap-3" aria-live="polite">
        <AnimatePresence>
          {successMsg && (
            <PerfilToast key="ok" msg={successMsg} type="success" />
          )}
          {errorMsg && <PerfilToast key="err" msg={errorMsg} type="error" />}
        </AnimatePresence>

        <div className="flex justify-stretch sm:justify-end">
          <button
            type="submit"
            form={formId}
            disabled={loading || !hasChanges}
            aria-busy={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-primary-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary-600 disabled:active:scale-100 sm:w-auto sm:py-2.5"
          >
            {loading ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />
                Guardando...
              </>
            ) : (
              <>
                <Save size={15} aria-hidden="true" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
};

export default PerfilEditForm;
