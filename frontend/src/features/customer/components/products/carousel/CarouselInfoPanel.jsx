import { MessageCircle, ShieldCheck, Store } from "lucide-react";

const benefits = [
  {
    icon: Store,
    text: "Retiro en sucursal disponible",
  },
  {
    icon: MessageCircle,
    text: "Seguimiento por WhatsApp",
  },
  {
    icon: ShieldCheck,
    text: "Pago online seguro integrado",
  },
];

const CarouselInfoPanel = () => {
  return (
    <div className="hidden shrink-0 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:flex lg:w-[290px]">
      <div className="space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-600">
            Tu Farmacia Digital
          </span>
          <h3 className="text-4xl font-extrabold leading-tight text-slate-950 tracking-tight">
            Pixel
            <br /> Salud
          </h3>
        </div>

        <ul className="space-y-5 text-sm font-medium text-slate-700">
          {benefits.map((benefit) => (
            <li key={benefit.text} className="flex items-center gap-3">
              <benefit.icon
                className="h-5 w-5 text-emerald-600"
                aria-hidden="true"
              />
              {benefit.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CarouselInfoPanel;
