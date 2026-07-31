import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ASSETS } from "../../../../utils/images";

const banners = [
  {
    id: "dermocosmetica",
    image: ASSETS.bannerDermocosmetica,
    category: "Dermocosmética",
    cta: "Explorar ahora",
  },
  {
    id: "cuidado-personal",
    image: ASSETS.bannerCuidadoPersonal,
    category: "Cuidado Personal",
    cta: "Explorar ahora",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const BannerPromo = () => {
  return (
    <motion.section
      aria-label="Promociones destacadas"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="mt-8 grid grid-cols-1 gap-4 sm:gap-6 md:mt-12 xl:grid-cols-2"
    >
      {banners.map((banner) => (
        <motion.div key={banner.id} variants={itemVariants}>
          <Link
            to={`/productos?categoria=${encodeURIComponent(banner.category)}`}
            className="group relative flex h-[220px] w-full overflow-hidden rounded-2xl bg-gray-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-[0.98] sm:h-[280px] md:h-80"
            aria-label={`Ver productos de la categoría ${banner.category}`}
          >
            <img
              src={banner.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-right transition-transform duration-700 ease-out group-hover:scale-105 sm:object-center"
            />

            <div className="absolute inset-0 flex w-3/4 flex-col justify-end p-5 sm:p-6 md:w-3/5 md:p-8">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm sm:text-3xl md:text-4xl">
                {banner.category}
              </h3>

              <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base">
                <span className="relative overflow-hidden pb-0.5">
                  <span className="relative z-10">{banner.cta}</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary-600 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 text-primary-600 transition-transform duration-300 group-hover:translate-x-1.5 sm:h-5 sm:w-5"
                />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.section>
  );
};

export default BannerPromo;
