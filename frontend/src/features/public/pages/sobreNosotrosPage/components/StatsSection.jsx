import { motion } from "framer-motion";
import RenderIcon from "./RenderIcon";
import { SOBRE_NOSOTROS_REVEAL_UP, STATS_DATA } from "../constants";

const StatsSection = () => (
  <motion.section
    {...SOBRE_NOSOTROS_REVEAL_UP}
    aria-labelledby="sobre-nosotros-stats-title"
    className="mt-6"
  >
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <h2 id="sobre-nosotros-stats-title" className="sr-only">
        Indicadores de Pixel Salud
      </h2>

      <ul
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        role="list"
      >
        {STATS_DATA.map(({ id, number, label, icon }) => (
          <li
            key={id}
            className="rounded-2xl border border-slate-100 bg-slate-50/60 px-3 py-4 text-center sm:px-4"
          >
            <div className="mx-auto mb-2 inline-flex rounded-lg border border-primary-100 bg-primary-50 p-2 text-primary-700">
              <RenderIcon icon={icon} size={18} />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {number}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:text-sm">
              {label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  </motion.section>
);

export default StatsSection;
