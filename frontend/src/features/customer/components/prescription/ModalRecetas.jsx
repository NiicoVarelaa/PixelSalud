import { X, FileCheck2 } from "lucide-react";

const ModalRecetas = ({ isOpen, onClose, recetas = [], onAddAllToCart }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/55 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-recetas-title"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <FileCheck2
              className="h-5 w-5 text-primary-700"
              aria-hidden="true"
            />
            <h2
              id="modal-recetas-title"
              className="text-lg font-bold text-gray-900"
            >
              Mis Recetas
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Cerrar modal de recetas"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto px-5 py-4 sm:px-6">
          {recetas.length === 0 ? (
            <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              No hay recetas para mostrar.
            </p>
          ) : (
            recetas.map((receta, index) => (
              <article
                key={receta.idReceta || receta.id || index}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3"
              >
                <h3 className="text-sm font-semibold text-gray-900">
                  {receta.nombreProducto || receta.medicamento || "Medicamento"}
                </h3>
                {receta.dosis && (
                  <p className="mt-1 text-sm text-gray-600">
                    Dosis: {receta.dosis}
                  </p>
                )}
                {receta.indicaciones && (
                  <p className="mt-1 text-sm text-gray-600">
                    Indicaciones: {receta.indicaciones}
                  </p>
                )}
              </article>
            ))
          )}
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={() => {
              onAddAllToCart?.();
              onClose();
            }}
            disabled={recetas.length === 0}
            className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Agregar Todo al Carrito
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ModalRecetas;
