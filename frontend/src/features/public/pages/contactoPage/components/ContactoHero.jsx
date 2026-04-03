import { motion } from "framer-motion";

const ContactoHero = ({ cardEnter }) => (
  <motion.section
    initial="hidden"
    animate="visible"
    variants={cardEnter}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mb-8 sm:p-6"
    aria-labelledby="contacto-title"
  >
    <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-50 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
      Soporte Pixel Salud
    </p>
    <h1
      id="contacto-title"
      className="text-balance text-2xl font-bold leading-tight text-slate-900 sm:text-3xl"
    >
      Contáctanos
    </h1>
    <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
      Resolvemos dudas de compras, productos y facturación. Si tu consulta es
      sobre pedido o receta, te pediremos iniciar sesión para proteger tus
      datos.
    </p>
  </motion.section>
);

export default ContactoHero;
