import PropTypes from "prop-types";
import CustomSelect from "../../../products/components/CustomSelect";
import { DateInput } from "./DateInput";


export function CriticalFiltersRow({
  filters,
  onFilterChange,
  opcionesEstado,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <DateInput
        id="fecha-desde"
        label="Desde"
        value={filters.fechaDesde}
        onChange={(value) => onFilterChange("fechaDesde", value)}
        descId="fecha-desde-desc"
      />
      <DateInput
        id="fecha-hasta"
        label="Hasta"
        value={filters.fechaHasta}
        onChange={(value) => onFilterChange("fechaHasta", value)}
        descId="fecha-hasta-desc"
      />
      <div>
        <CustomSelect
          id="estado-filter"
          label="Estado"
          value={filters.estado}
          onChange={(value) => onFilterChange("estado", value)}
          options={opcionesEstado}
        />
      </div>
    </div>
  );
}

export function AdvancedFiltersRow({
  filters,
  onFilterChange,
  opcionesCategoria,
  opcionesMetodoPago,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <CustomSelect
          id="metodo-pago-filter"
          label="Método de pago"
          value={filters.metodoPago}
          onChange={(value) => onFilterChange("metodoPago", value)}
          options={opcionesMetodoPago}
        />
      </div>
      <div>
        <CustomSelect
          id="categoria-filter"
          label="Categoría"
          value={filters.categoria}
          onChange={(value) => onFilterChange("categoria", value)}
          options={opcionesCategoria}
        />
      </div>
    </div>
  );
}

const filtersShape = PropTypes.shape({
  categoria: PropTypes.string.isRequired,
  estado: PropTypes.string.isRequired,
  fechaDesde: PropTypes.string.isRequired,
  fechaHasta: PropTypes.string.isRequired,
  metodoPago: PropTypes.string.isRequired,
}).isRequired;

const optionsShape = PropTypes.arrayOf(
  PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
).isRequired;

CriticalFiltersRow.propTypes = {
  filters: filtersShape,
  onFilterChange: PropTypes.func.isRequired,
  opcionesEstado: optionsShape,
};

AdvancedFiltersRow.propTypes = {
  filters: filtersShape,
  onFilterChange: PropTypes.func.isRequired,
  opcionesCategoria: optionsShape,
  opcionesMetodoPago: optionsShape,
};