import { FiCalendar, FiCheckCircle, FiMapPin, FiArrowLeft } from "react-icons/fi";

const CheckoutPickupStep = ({
  branches,
  selectedBranchId,
  onSelectBranch,
  onContinue,
  onBack,
}) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 bg-slate-50 p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900">Retiro</h2>
        <p className="mt-1 text-sm text-slate-600">
          Elegi la sucursal donde vas a retirar tu pedido.
        </p>
      </header>

      <div className="space-y-4 p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4">
          {branches.map((branch) => {
            const isSelected = selectedBranchId === branch.id;

            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => onSelectBranch(branch.id)}
                className={`w-full rounded-xl border-2 p-4 cursor-pointer text-left transition ${
                  isSelected
                    ? "border-primary-700 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-primary-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {branch.name}
                    </p>
                    <p className="mt-1 flex items-start gap-2 text-sm text-slate-700">
                      <FiMapPin className="mt-0.5 h-4 w-4 text-primary-800" />
                      {branch.address}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                      <FiCalendar className="h-4 w-4 text-primary-800" />
                      {branch.hours}
                    </p>
                    <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      RETIRO GRATIS EN SUCURSAL
                    </span>
                  </div>
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold ${
                      isSelected
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-slate-300 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex w-full items-center gap-2  justify-center rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto cursor-pointer"
          >
            <FiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={!selectedBranchId}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-base font-bold text-white transition sm:w-auto cursor-pointer 
            ${
              selectedBranchId
                ? "bg-primary-600 hover:bg-primary-700"
                : "cursor-not-allowed bg-slate-300"
            }`}
          >
            <FiCheckCircle className="h-5 w-5" />
            Continuar a Metodos de pago
          </button>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPickupStep;
