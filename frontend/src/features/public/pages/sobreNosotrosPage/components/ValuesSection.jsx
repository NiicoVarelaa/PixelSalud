import { motion } from "framer-motion";
import RenderIcon from "./RenderIcon";
import { SOBRE_NOSOTROS_REVEAL_UP, VALUES_DATA } from "../constants";

const ValuesSection = () => (
  <motion.section
    {...SOBRE_NOSOTROS_REVEAL_UP}
    aria-labelledby="sobre-nosotros-valores-title"
    className="mt-10 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:p-8"
  >
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
        <h2
          id="sobre-nosotros-valores-title"
          className="text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Valores que nos definen
        </h2>
        <p className="mt-2 text-base text-slate-600 sm:text-lg">
          Los pilares fundamentales que guían cada una de nuestras acciones.
        </p>
      </div>

      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
        role="list"
      >
        {VALUES_DATA.map(({ title, description, colorClass, icon }) => (
          <li
            key={title}
            className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
          >
            <div
              className={`mb-5 inline-flex rounded-xl border p-3 transition-transform duration-300 group-hover:scale-105 ${colorClass}`}
            >
              <RenderIcon icon={icon} size={24} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-primary-700 sm:text-xl">
              {title}
            </h3>
            <p className="mt-2 leading-relaxed text-slate-600">{description}</p>
          </li>
        ))}
      </ul>
    </div>
  </motion.section>
);

export default ValuesSection;
