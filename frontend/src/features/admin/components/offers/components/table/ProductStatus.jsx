import { motion } from "framer-motion";
import { Percent, AlertTriangle } from "lucide-react";

export const ProductStatus = ({
  tieneOferta,
  porcentajeDescuento,
  enCampana,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <div className="text-right">
        {enCampana && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-xl text-xs font-bold mb-2 shadow-sm"
          >
            <AlertTriangle size={14} aria-hidden="true" />
            En Campaña
          </motion.span>
        )}
        {tieneOferta ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl font-extrabold shadow-lg"
          >
            <Percent size={16} aria-hidden="true" />
            {porcentajeDescuento}% OFF
          </motion.span>
        ) : (
          <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">
            Sin oferta
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      {enCampana && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-[11px] font-bold whitespace-nowrap">
          <AlertTriangle size={12} aria-hidden="true" />
          En Campaña
        </span>
      )}
      {tieneOferta ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg text-xs font-extrabold shadow-md whitespace-nowrap">
          <Percent size={12} aria-hidden="true" />
          {porcentajeDescuento}% OFF
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium whitespace-nowrap">
          Sin oferta
        </span>
      )}
    </div>
  );
};
