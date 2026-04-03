import Navbar from "@features/public/components/navigation/Navbar";
import Footer from "@features/public/components/footer/Footer";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

const terminos = [
  {
    title: "Uso del sitio web",
    content:
      "El uso de este sitio implica la aceptación de los presentes términos y condiciones. Pixel Salud se reserva el derecho de modificar estos términos en cualquier momento.",
  },
  {
    title: "Privacidad de los datos",
    content:
      "La información personal proporcionada por los usuarios será tratada de manera confidencial y utilizada únicamente para los fines relacionados con la prestación de nuestros servicios.",
  },
  {
    title: "Precios y promociones",
    content:
      "Los precios y promociones publicados pueden variar sin previo aviso. Las ofertas tienen validez hasta agotar stock o hasta la fecha indicada.",
  },
  {
    title: "Formas de pago",
    content:
      "Aceptamos tarjetas de crédito, débito, transferencias y pagos en efectivo en sucursal. El pago debe realizarse en su totalidad para confirmar la compra.",
  },
  {
    title: "Política de cambios y devoluciones",
    content:
      "Los cambios y devoluciones se aceptan dentro de los 10 días de realizada la compra, presentando el ticket correspondiente y el producto en perfectas condiciones.",
  },
  {
    title: "Responsabilidad del usuario",
    content:
      "El usuario es responsable de la veracidad de los datos proporcionados y del uso adecuado del sitio conforme a la legislación vigente.",
  },
];

const TerminosCondiciones = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-6 sm:pt-8" role="main">
        <section
          className="layout py-6 sm:py-10 lg:px-8"
          aria-labelledby="terminos-title"
        >
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mb-7 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm sm:mb-10 sm:p-7"
          >
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 shadow-sm sm:h-14 sm:w-14">
                <FileText
                  className="h-6 w-6 text-primary-700 sm:h-7 sm:w-7"
                  aria-hidden="true"
                />
              </div>

              <h1
                id="terminos-title"
                className="text-balance text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl"
              >
                Términos y Condiciones
              </h1>

              <p className="mt-2 max-w-prose text-sm leading-relaxed text-gray-600 sm:text-base">
                Lee aquí los términos y condiciones de uso de Pixel Salud.
              </p>
            </div>
          </motion.header>

          <ul
            className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6"
            role="list"
          >
            {terminos.map((item, index) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-primary-500/70 focus-within:ring-offset-2 sm:p-6"
              >
                <h2 className="mb-2 text-base font-bold text-primary-700 sm:text-lg">
                  {item.title}
                </h2>

                <p className="text-sm leading-relaxed text-gray-700 sm:text-[0.95rem]">
                  {item.content}
                </p>
              </motion.li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default TerminosCondiciones;
