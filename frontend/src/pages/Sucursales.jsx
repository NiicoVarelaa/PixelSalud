import { Navbar, Footer } from "@components/organisms";
import { MapPin, Phone, CalendarDays } from "lucide-react";

const branches = [
  {
    name: "Sucursal Central",
    address: "25 de Mayo 789, San Miguel de Tucumán, Tucumán",
    hours: "Lunes a Viernes 9:00-21:00",
    phone: "+54 381 123-4567",
  },
  {
    name: "Sucursal Norte",
    address: "Av. Alem 199, San Miguel de Tucumán, Tucumán",
    hours: "Lunes a Sábado 8:00-22:00",
    phone: "+54 381 765-4321",
  },
];

const Sucursales = () => (
  <>
    <Navbar />
    <main className="min-h-screen pt-8" aria-label="Sucursales de Pixel Salud">
      <section className="py-8 sm:py-12">
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 shadow-lg">
            <MapPin
              className="w-7 h-7 text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            />
          </div>
          <h1
            className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight"
            tabIndex={0}
          >
            Sucursales
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-xs">
            Encuentra aquí la información de nuestras sucursales y horarios de
            atención.
          </p>
        </header>

        <ul className="grid gap-8 grid-cols-1 lg:grid-cols-2" role="list">
          {branches.map((branch) => (
            <li
              key={branch.name}
              className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-900 outline-none flex flex-col overflow-hidden"
              tabIndex={0}
              aria-label={`Información de ${branch.name}`}
            >
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin
                    className="w-6 h-6 text-primary-600 dark:text-primary-400 shrink-0"
                    aria-hidden="true"
                  />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors duration-200">
                    {branch.name}
                  </h2>
                </div>

                <address className="not-italic text-gray-700 dark:text-gray-300 text-base mb-4 flex items-start gap-3">
                  <span className="sr-only">Dirección:</span>
                  <MapPin
                    className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{branch.address}</span>
                </address>

                <div className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex items-center gap-3">
                  <CalendarDays
                    className="w-5 h-5 text-primary-500 dark:text-primary-300 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-medium block">Horario:</span>
                    {branch.hours}
                  </div>
                </div>

                <div className="mt-auto">
                  <a
                    href={`tel:${branch.phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white dark:bg-primary-500 dark:text-gray-900 font-semibold shadow hover:bg-primary-700 dark:hover:bg-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-all duration-200 active:scale-95"
                    aria-label={`Llamar a ${branch.name}`}
                    tabIndex={0}
                  >
                    <Phone className="w-5 h-5" aria-hidden="true" />
                    Llamar: {branch.phone}
                  </a>
                </div>
              </div>

              <div className="w-full h-64 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                <iframe
                  title={`Mapa de ${branch.name}`}
                  src={`https://www.google.com/maps?q=$?q=${encodeURIComponent(branch.address)}&output=embed`}
                  className="w-full h-full object-cover"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label={`Mapa de ${branch.name}`}
                ></iframe>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
    <Footer />
  </>
);

export default Sucursales;
