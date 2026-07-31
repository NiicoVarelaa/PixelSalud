import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgePercent, ChevronRight } from "lucide-react";

const PromoSideCard = ({ card, className = "" }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className={`relative flex h-full min-h-[172px] overflow-hidden rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-105 hover:shadow-md hover:border-orange-200 sm:p-5 ${className}`}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-100/80 transition-transform duration-500 ease-out hover:scale-110" />
      <div className="relative flex h-full w-full flex-col justify-between gap-3">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
            <BadgePercent className="h-3.5 w-3.5" aria-hidden="true" />
            {card.badge}
          </span>

          <h3 className="max-w-[22ch] text-lg font-extrabold leading-tight text-slate-800">
            {card.title}
          </h3>

          <p className="text-sm text-slate-500">{card.subtitle}</p>
          {card.detail && (
            <p className="line-clamp-2 text-sm font-medium text-slate-600">
              {card.detail}
            </p>
          )}
        </div>

        <Link
          to={card.ctaTo}
          className="group inline-flex w-fit cursor-pointer items-center gap-1 rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          aria-label={card.ctaAriaLabel}
        >
          Ver mas
          <ChevronRight
            className="h-4 w-4 translate-x-0 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  );
};

PromoSideCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    badge: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    detail: PropTypes.string,
    ctaTo: PropTypes.string.isRequired,
    ctaAriaLabel: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

export default PromoSideCard;
