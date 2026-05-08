import { Inbox, AlertCircle } from "lucide-react";

export const LoadingState = () => (
  <div className="bg-white rounded-xl border border-gray-100">
    <div
      className="flex flex-col items-center justify-center py-16"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-green-600 animate-spin"
        aria-hidden="true"
      />
      <p className="mt-3 text-sm text-gray-500">Cargando mensajes...</p>
    </div>
  </div>
);

export const EmptyState = () => (
  <div className="bg-white rounded-xl border border-gray-100">
    <div
      className="flex flex-col items-center justify-center py-16 text-center px-6"
      role="status"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100"
        aria-hidden="true"
      >
        <Inbox size={22} className="text-gray-400" />
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-700">
        No hay mensajes
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Los mensajes de tus clientes apareceran aqui
      </p>
    </div>
  </div>
);

export const ErrorBanner = ({ error }) => (
  <div
    role="alert"
    aria-live="assertive"
    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-2"
  >
    <AlertCircle
      size={16}
      className="mt-0.5 shrink-0 text-red-500"
      aria-hidden="true"
    />
    <div>
      <p className="text-xs font-semibold text-red-700">
        Error al cargar mensajes
      </p>
      <p className="mt-0.5 text-xs text-red-600">{error}</p>
    </div>
  </div>
);
