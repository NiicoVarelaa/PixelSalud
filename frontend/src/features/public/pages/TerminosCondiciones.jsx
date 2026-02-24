import React from "react";
import { Navbar, Footer } from "@components/organisms";
import { FileText } from "lucide-react";

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

const TerminosCondiciones = () => (
  <>
    <Navbar />
    <main className="min-h-screen pt-8">
      <section className="layout py-8 sm:py-12">
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 shadow-lg">
            <FileText
              className="w-7 h-7 text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            />
          </div>
          <h1
            className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight"
            tabIndex={0}
          >
            Términos y Condiciones
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Lee aquí los términos y condiciones de uso de Pixel Salud.
          </p>
        </header>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
          {terminos.map((item) => (
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

export default TerminosCondiciones;
