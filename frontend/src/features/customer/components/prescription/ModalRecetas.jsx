import React, { useEffect, useRef } from "react";

const ModalRecetas = ({ isOpen, onClose, recetas, onAddAllToCart }) => {
  const modalRef = useRef(null);

  // A11Y & UX: Cerrar con la tecla ESC y bloquear el scroll del body
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Previene scroll de fondo

    // Foco inicial en el modal para lectores de pantalla
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // BACKDROP: Cubre toda la pantalla, centra el contenido. z-index alto.
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity"
      role="presentation"
      onClick={onClose} // Cierra al hacer click fuera
    >
      {/* MODAL CONTAINER */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
        onClick={(e) => e.stopPropagation()} // Evita cierre al clickear dentro
        className="
          w-full max-h-[90vh] flex flex-col
          bg-white dark:bg-slate-900 
          rounded-t-2xl sm:rounded-2xl 
          shadow-2xl border border-gray-100 dark:border-slate-800
          sm:max-w-lg transition-all animate-fadeInUp sm:animate-fadeIn
          outline-none
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
          <h2 
            id="modal-title" 
            className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-primary-600 dark:text-primary-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden="true">
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 17v-2a4 4 0 014-4h3m4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v4' />
            </svg>
            Tus recetas activas
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-gray-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* BODY: Scrollable area */}
        <div className="flex-1 overflow-y-auto p-5 overscroll-contain">
          {recetas && recetas.length > 0 ? (
            <ul className="space-y-3">
              {recetas.map((receta) => (
                <li
                  key={receta.idReceta || receta.id || receta.productoId}
                  className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-slate-700 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start gap-3">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                      {receta.nombreProducto}
                    </span>
                    <span className="shrink-0 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-xs font-bold px-2 py-1 rounded-md">
                      x{receta.cantidad}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Emitida: {receta.fechaEmision}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-full mb-3">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden="true">
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 17v-2a4 4 0 014-4h3m4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v4' />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">No tienes recetas disponibles.</p>
              <p className="text-sm text-gray-400 mt-1">Las recetas nuevas aparecerán aquí.</p>
            </div>
          )}
        </div>

        {/* FOOTER: Sticky bottom actions */}
        <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 rounded-b-2xl flex flex-col-reverse sm:flex-row gap-3">
          <button
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            className="w-full flex-1 bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-primary-600/20 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-offset-slate-900"
            onClick={onAddAllToCart}
            disabled={!recetas || recetas.length === 0}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRecetas;