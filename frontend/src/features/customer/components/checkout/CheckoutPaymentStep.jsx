import { useState } from "react";
import { ArrowLeft, CheckCircle, CreditCard, Info, WalletCards } from "lucide-react";
import mpLogo from "@/assets/mpLogo.webp";

const CheckoutPaymentStep = ({ onBack, onPay, isProcessing }) => {
  const [selectedMethod, setSelectedMethod] = useState("mp");

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 bg-slate-50 p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900">Pago</h2>
        <p className="mt-1 text-sm text-slate-600">
          Para continuar con tu compra, selecciona tu metodo de pago.
        </p>
      </header>

      <div className="space-y-5 p-5 md:p-6">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div
            onClick={() => setSelectedMethod("mp")}
            className={`rounded-xl border p-3 text-sm font-semibold cursor-pointer ${
              selectedMethod === "mp"
                ? "border-primary-700 bg-slate-50 text-primary-700"
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">Mercado Pago</div>
              {selectedMethod === "mp" && (
                <CheckCircle className="h-5 w-5 text-primary-700" />
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500 cursor-not-allowed">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Tarjeta de debito
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500 cursor-not-allowed">
            <div className="flex items-center gap-2">
              <WalletCards className="h-4 w-4" />
              Tarjeta de credito
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-base font-semibold text-slate-900">
            Compra con tu Billetera de Mercado Pago, de manera facil y segura:
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                1
              </span>
              Presiona el boton "Pagar con Mercado Pago" y seras redirigido para
              abonar tu compra.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                2
              </span>
              Podras pagar con tarjetas guardadas, dinero disponible y mucho
              mas.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                3
              </span>
              Una vez confirmado el pago, volveras a nuestra pagina para ver tu
              orden confirmada.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4" />
            Si pagas con billetera de Mercado Pago, la acreditacion puede ser
            inmediata o demorar segun el medio elegido.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex w-full items-center gap-2  justify-center rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver
          </button>

          <button
            type="button"
            onClick={onPay}
            disabled={isProcessing}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-base font-bold text-white transition sm:w-auto cursor-pointer
            ${
              isProcessing
                ? "cursor-not-allowed bg-slate-300"
                : "bg-[#009EE3] hover:bg-[#008ACA]"
            }`}
          >
            <img src={mpLogo} alt="Mercado Pago" className="h-5 w-auto" />
            {isProcessing ? "Procesando..." : "Pagar con Mercado Pago"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPaymentStep;
