import { ArrowLeft } from "lucide-react";

const RegistroHeader = ({ onBack }) => {
  return (
    <header className="mb-6" aria-labelledby="registro-title">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-slate-50 hover:text-primary-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          aria-label="Volver al inicio de sesión"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <h1
          id="registro-title"
          className="text-center text-2xl font-extrabold tracking-tight text-primary-700 sm:text-3xl"
        >
          Crear Cuenta
        </h1>

        <div className="min-h-11 min-w-11" aria-hidden="true" />
      </div>
    </header>
  );
};

export default RegistroHeader;
