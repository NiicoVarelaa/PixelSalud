import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SOBRE_NOSOTROS_REVEAL_UP } from "../constants";

const CTASection = () => (
  <motion.section
    {...SOBRE_NOSOTROS_REVEAL_UP}
    className="my-12"
    aria-labelledby="sobre-nosotros-cta-title"
  >
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-linear-to-r from-primary-700 to-primary-900 px-5 py-9 text-center shadow-2xl sm:px-8 sm:py-12">
      <div
        className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px] opacity-10"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <h3
          id="sobre-nosotros-cta-title"
          className="text-2xl font-bold text-white sm:text-3xl md:text-4xl"
        >
          Tu bienestar es nuestra prioridad
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-base text-primary-100 sm:text-lg">
          Únete a miles de familias que confían en Pixel Salud. Estamos listos
          para asesorarte.
        </p>

        <Link
          to="/contacto"
          aria-label="Ir a la página de contacto"
          className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-primary-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 active:scale-[0.98] sm:px-8 sm:py-4 sm:text-lg"
        >
          Contactar con un especialista
        </Link>
      </div>
    </div>
  </motion.section>
);

export default CTASection;
