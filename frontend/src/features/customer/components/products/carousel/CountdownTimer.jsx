import { Clock3 } from "lucide-react";
import { useCampaignCountdown } from "../utils";

const CountdownTimer = ({ targetDate }) => {
  const { status, units } = useCampaignCountdown(targetDate);

  if (status === "active") {
    return (
      <div className="inline-flex h-12 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-bold text-emerald-700">
        <Clock3 className="h-4 w-4" />
        Promoción activa
      </div>
    );
  }

  if (status === "finished") {
    return (
      <div className="inline-flex h-12 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-700">
        <Clock3 className="h-4 w-4" />
        Promoción finalizada
      </div>
    );
  }

  return (
    <div className="inline-flex h-12 items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 shadow-sm">
      <Clock3 className="h-4 w-4 text-orange-600" />
      <div className="flex items-center gap-1 text-xs font-extrabold text-slate-900 sm:text-sm">
        {units.map((unit, index) => (
          <div key={unit} className="inline-flex items-center gap-1">
            <span className="rounded-md bg-orange-50 px-2 py-1 leading-none tabular-nums">
              {unit}
            </span>
            {index < units.length - 1 && (
              <span className="text-orange-500">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
