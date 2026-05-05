import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { DatePickerDay } from "@components/molecules";

const MODULOS = [
  { value: "", label: "Todos los módulos" },
  { value: "autenticacion", label: "Autenticación" },
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
  { value: "medico", label: "Médico" },
  { value: "cliente", label: "Cliente" },
  { value: "sistema", label: "Sistema" },
];

const selectCls =
  "h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 cursor-pointer transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100";

const inputCls =
  "h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 cursor-pointer transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100";

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

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-gray-200 bg-white shadow-xs"
      aria-label="Filtros de auditoría"
    >
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={14}
            className="text-gray-400"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Filtros
          </span>
        </div>
        <AnimatePresence>
          {hayFiltros && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              type="button"
              onClick={onLimpiar}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              aria-label="Limpiar todos los filtros"
            >
              <X size={11} aria-hidden="true" />
              Limpiar
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 gap-2.5 p-3 sm:grid-cols-2 lg:grid-cols-4 lg:p-3.5">
        <div>
          <label
            htmlFor="filtro-modulo"
            className="mb-1.5 block text-xs font-medium text-gray-500"
          >
            Módulo
          </label>
          <select
            id="filtro-modulo"
            value={filtros.modulo}
            onChange={(e) => onFiltroChange("modulo", e.target.value)}
            className={selectCls}
            aria-label="Filtrar por módulo"
          >
            {MODULOS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filtro-usuario"
            className="mb-1.5 block text-xs font-medium text-gray-500"
          >
            Tipo de usuario
          </label>
          <select
            id="filtro-usuario"
            value={filtros.tipoUsuario}
            onChange={(e) => onFiltroChange("tipoUsuario", e.target.value)}
            className={selectCls}
            aria-label="Filtrar por tipo de usuario"
          >
            {TIPOS_USUARIO.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <DatePickerDay
            id="filtro-desde"
            label="Desde"
            value={filtros.fechaDesde}
            onChange={(value) => onFiltroChange("fechaDesde", value)}
            ariaLabel="Fecha de inicio del filtro"
            buttonClassName={inputCls}
          />
        </div>

        <div>
          <DatePickerDay
            id="filtro-hasta"
            label="Hasta"
            value={filtros.fechaHasta}
            onChange={(value) => onFiltroChange("fechaHasta", value)}
            ariaLabel="Fecha de fin del filtro"
            buttonClassName={inputCls}
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-100 px-3 py-2.5 lg:px-3.5">
        <button
          type="button"
          onClick={onBuscar}
          className="inline-flex items-center gap-1.5 h-8 rounded-lg bg-green-600 hover:bg-green-700 active:scale-95 px-4 text-xs font-semibold text-white transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          aria-label="Aplicar filtros y buscar"
        >
          <Search size={13} aria-hidden="true" />
          Buscar
        </button>
      </div>
    </motion.section>
  );
};
