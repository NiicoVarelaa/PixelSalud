export const EmpleadoModalActions = ({ enviando, esEdicion, onClose }) => {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3.5 shrink-0 bg-gray-50/70">
      <button
        type="button"
        onClick={onClose}
        disabled={enviando}
        className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        Cancelar
      </button>
      <button
        type="submit"
        form="form-empleado"
        disabled={enviando}
        className="h-9 px-5 rounded-lg bg-green-600 hover:bg-green-700 text-sm font-semibold text-white disabled:opacity-40 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
      >
        {enviando
          ? "Guardando..."
          : esEdicion
            ? "Guardar cambios"
            : "Crear empleado"}
      </button>
    </div>
  );
};
