import { AtSign, Building2, Clock3, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

const ContactoBranchesSection = ({ cardEnter, sucursales, mapUrl }) => (
  <motion.aside
    initial="hidden"
    animate="visible"
    variants={cardEnter}
    transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-5 lg:h-full flex flex-col"
    aria-labelledby="info-contacto-title"
  >
    <h2
      id="info-contacto-title"
      className="text-lg font-semibold text-slate-900"
    >
      Nuestras sucursales
    </h2>
    <p className="mt-1 text-sm text-slate-600">
      Encontrá la sucursal más cercana, su horario y vías de contacto.
    </p>

    <div className="mt-4 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-1 lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
      {sucursales.map((branch, index) => (
        <motion.article
          key={branch.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.04 * index }}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3"
        >
          <div className="flex items-start gap-3">
            <span className="rounded-lg bg-primary-100 p-2 text-primary-700">
              <Building2 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-800">
                {branch.name}
              </h3>

              <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{branch.address}</span>
              </p>

              <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
                <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{branch.hours}</span>
              </p>

              <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <a
                  href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                  className="underline-offset-2 transition hover:text-primary-700 hover:underline"
                >
                  {branch.phone}
                </a>
              </p>

              <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
                <AtSign className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <a
                  href="mailto:contacto@pixelsalud.com"
                  className="underline-offset-2 transition hover:text-primary-700 hover:underline"
                >
                  contacto@pixelsalud.com
                </a>
              </p>
            </div>
          </div>
        </motion.article>
      ))}
    </div>

    <div className="mt-5 border-t border-slate-200 pt-5 shrink-0">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Ubicación</h3>
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <iframe
          src={mapUrl}
          width="100%"
          height="240"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Ubicación de Pixel Salud en San Miguel de Tucumán"
        />
      </div>
    </div>
  </motion.aside>
);

export default ContactoBranchesSection;
