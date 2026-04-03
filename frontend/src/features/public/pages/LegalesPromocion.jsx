import Navbar from "@features/public/components/navigation/Navbar";
import Footer from "@features/public/components/footer/Footer";
import { BadgePercent } from "lucide-react";
import { motion } from "framer-motion";

const legales = [
  {
    title: "Vigencia de las promociones",
    content:
      "Las promociones son válidas únicamente durante el período indicado en cada campaña o hasta agotar stock, lo que ocurra primero.",
  },
  {
    title: "Stock sujeto a disponibilidad",
    content:
      "Las ofertas y descuentos aplican solo a productos con stock disponible al momento de la compra. No acumulable con otras promociones.",
  },
  {
    title: "Imágenes ilustrativas",
    content:
      "Las imágenes de productos y promociones son de carácter ilustrativo. Los productos pueden variar según disponibilidad.",
  },
  {
    title: "Condiciones de participación",
    content:
      "Para acceder a las promociones, el cliente debe cumplir con los requisitos y condiciones especificados en cada campaña.",
  },
  {
    title: "Modificación o cancelación",
    content:
      "Pixel Salud se reserva el derecho de modificar, cancelar o suspender promociones sin previo aviso, por razones comerciales o de fuerza mayor.",
  },
  {
    title: "Promociones exclusivas online",
    content:
      "Algunas promociones pueden estar disponibles únicamente para compras realizadas a través de nuestra tienda online y no en sucursales físicas.",
  },
];

const LegalesPromocion = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-6 sm:pt-8" role="main">
        <section
          className="layout py-6 sm:py-10 lg:px-8"
          aria-labelledby="legales-title"
        >
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mb-7 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm sm:mb-10 sm:p-7"
          >
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 shadow-sm sm:h-14 sm:w-14">
                <BadgePercent
                  className="h-6 w-6 text-primary-700 sm:h-7 sm:w-7"
                  aria-hidden="true"
                />
              </div>

              <h1
                id="legales-title"
                className="text-balance text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl"
              >
                Legales de Promoción
              </h1>

              <p className="mt-2 max-w-prose text-sm leading-relaxed text-gray-600 sm:text-base">
                Consulta aquí la información legal relacionada con nuestras
                promociones.
              </p>
            </div>
          </motion.header>

          <ul
            className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6"
            role="list"
          >
            {legales.map((item, index) => (
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

export default LegalesPromocion;
