import { AtSign, Mail, Send, User } from "lucide-react";
import { motion } from "framer-motion";
import ContactoInputField from "./ContactoInputField";
import ContactoTipoConsultaField from "./ContactoTipoConsultaField";
import ContactoTextareaField from "./ContactoTextareaField";

const ContactoFormSection = ({
  cardEnter,
  formData,
  errors,
  onChange,
  onSubmit,
  isSubmitting,
  showLoginWarning,
  tipoConsultaOptions,
}) => (
  <motion.section
    initial="hidden"
    animate="visible"
    variants={cardEnter}
    transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-7 lg:h-full"
    aria-labelledby="formulario-title"
  >
    <h2 id="formulario-title" className="text-lg font-semibold text-slate-900">
      Envíanos tu consulta
    </h2>
    <p className="mt-1 text-sm text-slate-600">
      Completá el formulario y te responderemos a la brevedad.
    </p>

    <form
      onSubmit={onSubmit}
      noValidate
      className="mt-5 space-y-4 sm:space-y-5"
      aria-label="Formulario de contacto"
    >
      <ContactoInputField
        id="nombre"
        name="nombre"
        label="Nombre"
        icon={<User className="h-4 w-4" />}
        value={formData.nombre}
        onChange={onChange}
        error={errors.nombre}
        placeholder="Tu nombre"
        maxLength="100"
      />

      <ContactoInputField
        id="email"
        name="email"
        type="email"
        label="Correo electrónico"
        icon={<Mail className="h-4 w-4" />}
        value={formData.email}
        onChange={onChange}
        error={errors.email}
        placeholder="tuemail@ejemplo.com"
        maxLength="100"
      />

      <ContactoTipoConsultaField
        value={formData.tipoConsulta}
        onChange={onChange}
        options={tipoConsultaOptions}
        showLoginWarning={showLoginWarning}
      />

      <ContactoInputField
        id="asunto"
        name="asunto"
        label="Asunto"
        icon={<AtSign className="h-4 w-4" />}
        value={formData.asunto}
        onChange={onChange}
        error={errors.asunto}
        placeholder="Motivo del mensaje (opcional)"
        maxLength="200"
      />

      <ContactoTextareaField
        value={formData.mensaje}
        onChange={onChange}
        error={errors.mensaje}
      />

      <motion.button
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary-700 bg-primary-700 px-4 text-sm font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 active:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Enviar mensaje</span>
          </>
        )}
      </motion.button>
    </form>
  </motion.section>
);

export default ContactoFormSection;
