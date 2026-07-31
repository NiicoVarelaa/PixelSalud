const StatCard = ({ icon, label, value, color }) => {
  const Icon = icon;
  return (
    <div className={`group flex items-center gap-4 rounded-2xl border-l-4 bg-white p-5 shadow-sm transition-all hover:shadow-md ${color.border}`}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color.bg}`}>
        <Icon size={20} className={color.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <p className="mt-0.5 text-xl font-bold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
