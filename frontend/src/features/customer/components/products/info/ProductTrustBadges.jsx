import { memo } from "react";
import { TRUST_BADGES } from "../utils";

const TrustBadge = memo(({ icon: Icon, label }) => (
  <div className="flex flex-col items-center gap-1.5 text-center">
    <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center">
      {Icon && (
        <Icon size={16} className="text-primary-700" aria-hidden="true" />
      )}
    </div>
    <span className="text-[11px] leading-tight text-gray-500 font-medium">
      {label}
    </span>
  </div>
));

TrustBadge.displayName = "TrustBadge";

const ProductTrustBadges = memo(() => (
  <div
    className="grid grid-cols-4 gap-2 py-3 border-y border-gray-100 mt-auto"
    aria-label="Beneficios de compra"
  >
    {TRUST_BADGES.map(({ icon, label }) => (
      <TrustBadge key={label} icon={icon} label={label} />
    ))}
  </div>
));

ProductTrustBadges.displayName = "ProductTrustBadges";

export default ProductTrustBadges;
