import { useMemo } from "react";
import { Search, RotateCcw } from "lucide-react";
import CustomSelect from "@features/admin/components/products/components/CustomSelect";
import { DatePickerDay } from "@components/molecules";

const MODULOS = [
  { value: "", label: "Todos los modulos" },
  { value: "autenticacion", label: "Autenticacion" },
  { value: "ventas", label: "Ventas" },
  { value: "productos", label: "Productos" },
  { value: "permisos", label: "Permisos" },
  { value: "usuarios", label: "Usuarios" },
  { value: "ofertas", label: "Ofertas" },
  { value: "mercadopago", label: "MercadoPago" },
];

const TIPOS_USUARIO = [
  { value: "", label: "Todos los usuarios" },
  { value: "admin", label: "Admin" },
  { value: "empleado", label: "Empleado" },
  { value: "medico", label: "Medico" },
  { value: "cliente", label: "Cliente" },
  { value: "sistema", label: "Sistema" },
];

export const AuditoriaFilters = ({
  filtros,
  onFiltroChange,
  onLimpiar,
  onBuscar,
}) => {
  const hayFiltros =
    filtros.modulo ||
    filtros.tipoUsuario ||
    filtros.fechaDesde ||
    filtros.fechaHasta;

  const opcionesModulo = useMemo(
    () => MODULOS.map((m) => ({ value: m.value, label: m.label })),
    [],
  );

  const opcionesTipoUsuario = useMemo(
    () => TIPOS_USUARIO.map((t) => ({ value: t.value, label: t.label })),
    [],
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
      <div className="flex flex-wrap sm:flex-nowrap items-end gap-3">
        <div className="w-full sm:w-44">
          <CustomSelect
            id="filter-audit-modulo"
            label="Modulo"
            value={filtros.modulo}
            onChange={(v) => onFiltroChange("modulo", v)}
            options={opcionesModulo}
            hideLabel
          />
        </div>

        <div className="w-full sm:w-44">
          <CustomSelect
            id="filter-audit-usuario"
            label="Usuario"
            value={filtros.tipoUsuario}
            onChange={(v) => onFiltroChange("tipoUsuario", v)}
            options={opcionesTipoUsuario}
            hideLabel
          />
        </div>

        <div className="w-full sm:w-36">
          <DatePickerDay
            id="filtro-desde"
            label="Desde"
            value={filtros.fechaDesde}
            onChange={(value) => onFiltroChange("fechaDesde", value)}
            ariaLabel="Fecha de inicio del filtro"
            buttonClassName="h-[42px] w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 cursor-pointer transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15 hover:border-gray-300 hover:bg-white"
          />
        </div>

        <div className="w-full sm:w-36">
          <DatePickerDay
            id="filtro-hasta"
            label="Hasta"
            value={filtros.fechaHasta}
            onChange={(value) => onFiltroChange("fechaHasta", value)}
            ariaLabel="Fecha de fin del filtro"
            buttonClassName="h-[42px] w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 cursor-pointer transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15 hover:border-gray-300 hover:bg-white"
          />
        </div>

        <div className="w-full sm:w-auto flex gap-2">
          <button
            type="button"
            onClick={onBuscar}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-green-600/20 focus-visible:ring-4 focus-visible:ring-green-500/30 outline-none cursor-pointer whitespace-nowrap h-[42px]"
            aria-label="Aplicar filtros y buscar"
          >
            <Search size={18} />
            <span className="text-sm font-medium hidden sm:inline">Buscar</span>
          </button>

          {hayFiltros && (
            <button
              type="button"
              onClick={onLimpiar}
              className="flex items-center justify-center gap-1.5 h-[42px] px-3 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 whitespace-nowrap"
              aria-label="Limpiar todos los filtros"
            >
              <RotateCcw size={15} />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
