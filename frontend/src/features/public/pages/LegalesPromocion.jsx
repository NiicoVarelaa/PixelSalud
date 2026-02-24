import React from "react";
import { Navbar, Footer } from "@components/organisms";
import { BadgePercent } from "lucide-react";

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

const LegalesPromocion = () => (
  <>
    <Navbar />
    <main className="min-h-screen pt-8">
      <section className="layout py-8 sm:py-12">
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 shadow-lg">
            <BadgePercent
              className="w-7 h-7 text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            />
          </div>
          <h1
            className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight"
            tabIndex={0}
          >
            Legales de Promoción
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Consulta aquí la información legal relacionada con nuestras
            promociones.
          </p>
        </header>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
          {legales.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-6"
            >
              <h2 className="text-lg font-bold text-primary-700 dark:text-primary-400 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {item.content}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
    <Footer />
  </>
);

export default LegalesPromocion;
