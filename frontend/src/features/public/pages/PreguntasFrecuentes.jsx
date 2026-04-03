import { useState } from "react";
import Navbar from "@features/public/components/navigation/Navbar";
import Footer from "@features/public/components/footer/Footer";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    question: "¿Cuáles son los medios de pago disponibles?",
    answer:
      "Aceptamos tarjetas de crédito, débito, transferencias bancarias y pagos en efectivo en sucursal.",
  },
  {
    question: "¿Puedo reservar productos para retirar luego?",
    answer:
      "Sí, podés reservar productos desde la web y retirarlos en la sucursal seleccionada dentro de las 24 horas.",
  },
  {
    question: "¿Puedo retirar mi compra en una sucursal?",
    answer:
      "Por supuesto, puedes seleccionar la opción de retiro en sucursal al momento de comprar.",
  },
  {
    question: "¿Cómo puedo consultar el estado de mi pedido?",
    answer:
      "Puedes consultar el estado de tu pedido desde tu perfil o contactándonos por WhatsApp o teléfono.",
  },
  {
    question: "¿Qué hago si tengo un problema con mi compra?",
    answer:
      "Nuestro equipo de atención al cliente está disponible para ayudarte. Escríbenos o llámanos y resolveremos tu inconveniente.",
  },
  {
    question: "¿Puedo solicitar factura A?",
    answer:
      "Sí, emitimos factura A para compras realizadas por empresas o profesionales. Solicitá la factura al momento de la compra o comunicate con atención al cliente.",
  },
];

const PreguntasFrecuentes = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-6 sm:pt-8" role="main">
        <section
          className="layout py-6 sm:py-10 lg:px-8"
          aria-labelledby="faq-title"
        >
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mb-7 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm sm:mb-10 sm:p-7"
          >
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 shadow-sm sm:h-14 sm:w-14">
                <HelpCircle
                  className="h-6 w-6 text-primary-700 sm:h-7 sm:w-7"
                  aria-hidden="true"
                />
              </div>

              <h1
                id="faq-title"
                className="text-balance text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl"
              >
                Preguntas Frecuentes
              </h1>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
                Respuestas rápidas a las consultas más comunes de nuestros
                clientes.
              </p>
            </div>
          </motion.header>

          <ul className="space-y-3 sm:space-y-4" role="list">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <motion.li
                  key={faq.question}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.02 }}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <h2>
                    <button
                      type="button"
                      onClick={() => handleToggle(idx)}
                      className="group flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-primary-50 active:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2 sm:px-5 cursor-pointer"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${idx}`}
                      id={`faq-header-${idx}`}
                      aria-label={`Abrir respuesta: ${faq.question}`}
                    >
                      <span className="text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-primary-700 sm:text-base">
                        {faq.question}
                      </span>

                      {isOpen ? (
                        <ChevronUp
                          className="h-5 w-5 shrink-0 text-primary-700"
                          aria-hidden="true"
                        />
                      ) : (
                        <ChevronDown
                          className="h-5 w-5 shrink-0 text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </h2>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${idx}`}
                        role="region"
                        aria-labelledby={`faq-header-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm leading-relaxed text-gray-700 sm:px-5 sm:text-[0.95rem]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PreguntasFrecuentes;
