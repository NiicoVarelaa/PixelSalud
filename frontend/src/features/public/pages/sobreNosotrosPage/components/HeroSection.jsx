import { motion } from "framer-motion";
import { SOBRE_NOSOTROS_REVEAL_UP } from "../constants";

const HeroSection = () => (
  <motion.section
    {...SOBRE_NOSOTROS_REVEAL_UP}
    aria-labelledby="sobre-nosotros-hero-title"
    className="relative mt-4 overflow-hidden rounded-3xl border border-primary-100 bg-linear-to-b from-primary-50/80 via-white to-white px-4 pb-10 pt-10 sm:px-8 sm:pt-14 sm:pb-14"
  >
    <div
      className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-100/60 blur-3xl sm:h-80 sm:w-80"
      aria-hidden="true"
    />
    <div
      className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-sky-100/40 blur-3xl"
      aria-hidden="true"
    />

    <div className="relative mx-auto max-w-4xl text-center">
      <p className="mb-4 inline-flex items-center rounded-full border border-primary-100 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">
        Sobre nosotros
      </p>

      <h1
        id="sobre-nosotros-hero-title"
        className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
      >
        Revolucionando el cuidado de tu{" "}
        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">
          Salud
        </span>
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
        En Pixel Salud fusionamos la calidez de la atención tradicional con la
        innovación tecnológica para brindarte una experiencia única.
      </p>
    </div>
  </motion.section>
);

export default HeroSection;
