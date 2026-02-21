import React, { useState } from "react";
import { Navbar, Footer } from "@components/organisms";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

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
      <main className="min-h-screen pt-8">
        <section className="layout py-8 sm:py-12">
          <header className="mb-10 flex flex-col items-center text-center">
            <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 shadow-lg">
              <HelpCircle
                className="w-7 h-7 text-primary-600 dark:text-primary-400"
                aria-hidden="true"
              />
            </div>
            <h1
              className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight"
              tabIndex={0}
            >
              Preguntas Frecuentes
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 max-w-xs">
              Respuestas a las preguntas más comunes de nuestros clientes.
            </p>
          </header>

          {/* CAMBIO PRINCIPAL AQUÍ: Usamos columns-2 en lugar de grid */}
          <ul className="sm:columns-2 gap-5 space-y-5" role="list">
            {faqs.map((faq, idx) => (
              <li
                key={faq.question}
                /* AGREGADO: break-inside-avoid evita que la tarjeta se parta entre columnas */
                className="break-inside-avoid mb-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 hover:cursor-pointer"
                tabIndex={0}
                style={{ outline: "none" }}
              >
                <div
                  className="w-full flex items-center justify-between px-5 py-4 text-left rounded-2xl group cursor-pointer select-none"
                  onClick={() => handleToggle(idx)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-panel-${idx}`}
                  id={`faq-header-${idx}`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleToggle(idx);
                  }}
                >
                  <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors duration-200 cursor-pointer">
                    {faq.question}
                  </span>
                  <span className="cursor-pointer flex items-center">
                    {openIndex === idx ? (
                      <ChevronUp
                        className="w-5 h-5 text-primary-600 dark:text-primary-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronDown
                        className="w-5 h-5 text-gray-400 dark:text-gray-500"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </div>
                {openIndex === idx && (
                  <div
                    id={`faq-panel-${idx}`}
                    role="region"
                    aria-labelledby={`faq-header-${idx}`}
                    className="px-5 pb-4 text-gray-700 dark:text-gray-300 text-sm animate-fadeIn"
                  >
                    {faq.answer}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PreguntasFrecuentes;
