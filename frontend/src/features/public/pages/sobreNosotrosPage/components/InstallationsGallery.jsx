import { motion } from "framer-motion";
import { GALLERY_ITEMS, SOBRE_NOSOTROS_REVEAL_UP } from "../constants";

const InstallationsGallery = () => (
  <motion.section
    {...SOBRE_NOSOTROS_REVEAL_UP}
    aria-labelledby="sobre-nosotros-galeria-title"
    className="mt-10"
  >
    <div className="w-full">
      <h2
        id="sobre-nosotros-galeria-title"
        className="text-center text-2xl font-bold text-slate-900 sm:text-3xl"
      >
        Nuestras Instalaciones
      </h2>

      <ul
        className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
        role="list"
      >
        {GALLERY_ITEMS.map(({ id, img, alt, className }) => (
          <li
            key={id}
            className={`${className} group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm`}
          >
            <figure className="relative h-64 overflow-hidden sm:h-72">
              <img
                src={img}
                alt={alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent p-4 text-sm font-semibold text-white sm:text-base">
                {alt}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  </motion.section>
);

export default InstallationsGallery;
