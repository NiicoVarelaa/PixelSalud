import { X, UserPlus, UserCog } from "lucide-react";

export const EmpleadoModalHeader = ({
  esEdicion,
  closeRef,
  onClose,
  enviando,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100">
          {esEdicion ? (
            <UserCog size={17} className="text-green-700" aria-hidden="true" />
          ) : (
            <UserPlus size={17} className="text-green-700" aria-hidden="true" />
          )}
        </div>
        <div>
          <h2
            id="empleado-modal-title"
            className="text-sm font-semibold text-gray-900 leading-none"
          >
            {esEdicion ? "Editar empleado" : "Nuevo empleado"}
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            {esEdicion
              ? "Modificá los datos del empleado"
              : "Completá los datos para registrar"}
          </p>
        </div>
      </div>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        disabled={enviando}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        aria-label="Cerrar modal"
      >
        <X size={17} />
      </button>
    </div>
  );
};
