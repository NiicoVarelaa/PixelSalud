export const CuponModalActions = ({ onClose }) => {
  return (
    <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-3.5">
      <button
        type="button"
        onClick={onClose}
        className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        Cancelar
      </button>
      <button
        type="submit"
        form="form-cupon"
        className="h-9 rounded-lg bg-green-600 px-5 text-sm font-semibold text-white transition-all hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 active:scale-95"
      >
        Crear cupón
      </button>
    </div>
  );
};
