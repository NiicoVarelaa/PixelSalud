import { Lock, ShoppingBag, Truck } from "lucide-react";

const steps = [
  {
    id: 1,
    label: "Paso 1",
    title: "Datos personales",
    icon: ShoppingBag,
  },
  {
    id: 2,
    label: "Paso 2",
    title: "Retiro en sucursal",
    icon: Truck,
  },
  {
    id: 3,
    label: "Paso 3",
    title: "Pago",
    icon: Lock,
  },
];

export const CheckoutSteps = ({ currentStep = 1 }) => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 rounded-2xl sm:grid-cols-3 ">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                isActive
                  ? "border-primary-700 bg-green-50 shadow-sm"
                  : "border-gray-100 bg-white shadow-sm"
              }`}
            >
              <div
                className={`rounded-lg p-2 ${
                  isCompleted || isActive
                    ? "bg-primary-600 text-white"
                    : "bg-slate-100 text-gray-500"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {step.label}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {step.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
