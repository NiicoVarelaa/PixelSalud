import { motion } from "framer-motion";
import {
  EXPERTISE_TAGS,
  PHILOSOPHY_IMAGES,
  SOBRE_NOSOTROS_REVEAL_UP,
} from "../constants";

const PhilosophySection = () => (
  <motion.section
    {...SOBRE_NOSOTROS_REVEAL_UP}
    aria-labelledby="sobre-nosotros-filosofia-title"
    className="mt-10"
  >
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="space-y-8">
          <div>
            <h2
              id="sobre-nosotros-filosofia-title"
              className="inline-block text-2xl font-bold text-slate-900 sm:text-3xl"
            >
              Nuestra Filosofía
            </h2>
            <span
              className="mt-2 block h-1.5 w-24 rounded-full bg-primary-500"
              aria-hidden="true"
            />
          </div>

          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            En{" "}
            <strong className="font-semibold text-primary-700">
              Pixel Salud
            </strong>
            , creemos que la farmacia moderna debe ser un centro integral de
            bienestar. No solo dispensamos medicamentos; construimos relaciones
            basadas en la empatía.
          </p>

          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            Combinamos 20 años de trayectoria con las últimas herramientas
            digitales para estar cerca de ti, donde quiera que estés.
          </p>

          <ul className="flex flex-wrap gap-3 pt-2" role="list">
            {EXPERTISE_TAGS.map((tag) => (
              <li
                key={tag}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary-500"
                  aria-hidden="true"
                />
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
          <div
            className="absolute -inset-4 -z-10 rounded-full bg-primary-100/50 opacity-50 blur-3xl"
            aria-hidden="true"
          />
          <img
            src={PHILOSOPHY_IMAGES.primary}
            alt="Laboratorio farmacéutico"
            loading="lazy"
            className="h-48 w-full translate-y-4 rounded-2xl object-cover shadow-lg transition-transform duration-500 hover:-translate-y-1 sm:h-64"
          />
          <img
            src={PHILOSOPHY_IMAGES.secondary}
            alt="Atención al cliente"
            loading="lazy"
            className="h-48 w-full rounded-2xl object-cover shadow-lg transition-transform duration-500 hover:translate-y-1 sm:h-64"
          />
        </div>
      </div>
    </div>
  </motion.section>
);

export default PhilosophySection;
