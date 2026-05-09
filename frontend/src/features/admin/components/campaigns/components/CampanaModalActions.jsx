const getValidationMessage = ({
  campana,
  productosSeleccionados,
  esDosPorUno,
}) => {
  if (!campana.nombreCampana?.trim()) return "Falta el nombre";
  if (!campana.fechaInicio) return "Falta la fecha de inicio";
  if (!campana.fechaFin) return "Falta la fecha de fin";
  if (campana.fechaInicio && campana.fechaFin && new Date(campana.fechaFin) < new Date(campana.fechaInicio)) {
    return "La fecha de fin debe ser posterior a la de inicio";
  }
  if (productosSeleccionados.length === 0)
    return "Seleccioná al menos un producto";
  if (!esDosPorUno) {
    if (!campana.porcentajeDescuento) return "Falta el descuento";
    const val = parseFloat(campana.porcentajeDescuento);
    if (val <= 0) return "El descuento debe ser mayor a 0";
    if (val > 100) return "El descuento no puede ser mayor a 100%";
  }
  return "";
};

export const CampanaModalActions = ({
  isFormValid,
  campana,
  productosSeleccionados,
  esDosPorUno,
  onClose,
  modoEdicion,
}) => {
  const validationMessage = getValidationMessage({
    campana,
    productosSeleccionados,
    esDosPorUno,
  });

  return (
    <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3.5 shrink-0">
      {!isFormValid && (
        <p className="mr-auto text-xs text-gray-400">{validationMessage}</p>
      )}

      <button
        type="button"
        onClick={onClose}
        className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        Cancelar
      </button>

      <button
        type="submit"
        form="form-campana"
        disabled={!isFormValid}
        className="h-9 px-5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
      >
        {modoEdicion ? "Guardar cambios" : "Crear campaña"}
      </button>
    </div>
  );
};
