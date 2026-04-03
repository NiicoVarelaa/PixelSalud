import Navbar from "@features/public/components/navigation/Navbar";
import Footer from "@features/public/components/footer/Footer";
import { MapPin, Phone, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { sucursalesData } from "@data/sucursalesData";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const Sucursales = () => (
  <>
    <Navbar />

    <main
      id="sucursales-main"
      className="min-h-screen bg-slate-50 pb-10"
      aria-labelledby="sucursales-title"
    >
      <section className="mx-auto w-full max-w-7xl lg:px-8 my-8 lg:my-12">
        <header className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary-100 bg-primary-50 sm:h-14 sm:w-14">
            <MapPin className="h-6 w-6 text-primary-700" aria-hidden="true" />
          </div>

          <h1
            id="sucursales-title"
            className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            Sucursales
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Encuentra la sucursal más cercana, su horario de atención y un
            acceso rápido para llamarnos.
          </p>
        </header>

        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2"
          role="list"
          aria-label="Listado de sucursales"
        >
          {sucursalesData.map((branch) => (
            <motion.li
              key={branch.name}
              variants={cardVariants}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2"
              aria-label={`Información de ${branch.name}`}
            >
              <article
                className="flex h-full flex-col"
                aria-labelledby={`branch-${branch.name}`}
              >
                <div className="flex-1 p-4 sm:p-6">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2
                      id={`branch-${branch.name}`}
                      className="text-lg font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-primary-700 sm:text-xl"
                    >
                      {branch.name}
                    </h2>
                  </div>

                  <address className="mb-4 px-2 flex items-start gap-3 text-sm not-italic text-slate-700 sm:text-base">
                    <MapPin
                      className="mt-0.5 h-5 w-5 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                    <span>{branch.address}</span>
                  </address>

                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 sm:text-base">
                    <CalendarDays
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-slate-800">Horario</p>
                      <p>{branch.hours}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${branch.phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 active:scale-[0.98] sm:w-auto"
                    aria-label={`Llamar a ${branch.name}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Llamar: {branch.phone}
                  </a>
                </div>

                <div className="h-56 border-t border-slate-200 bg-slate-100 sm:h-64">
                  <iframe
                    title={`Mapa de ${branch.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(branch.address)}&output=embed`}
                    className="h-full w-full cursor-pointer"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    aria-label={`Mapa de ${branch.name}`}
                  />
                </div>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </main>

    <Footer />
  </>
);

export default Sucursales;
