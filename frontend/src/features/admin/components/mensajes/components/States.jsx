import { motion } from "framer-motion";

export const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    <p className="mt-4 text-gray-500">Cargando mensajes...</p>
  </div>
);

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
    <svg
      className="w-16 h-16 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
    <p className="text-lg font-medium">No hay mensajes</p>
    <p className="text-sm mt-1">Los mensajes recibidos aparecerán aquí</p>
  </div>
);

export const ErrorBanner = ({ error }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
  >
    <p className="font-medium">Error</p>
    <p className="text-sm">{error}</p>
  </motion.div>
);
