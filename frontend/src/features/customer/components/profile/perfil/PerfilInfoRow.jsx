const PerfilInfoRow = ({ icon, label, value }) => {
  const IconComponent = icon;

  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 transition-colors duration-150 group hover:bg-slate-100/70 sm:p-4">
      <div
        className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm transition-shadow group-hover:shadow"
        aria-hidden="true"
      >
        <IconComponent size={17} />
      </div>
      <div className="min-w-0">
        <p className="mb-1 text-xs font-semibold uppercase leading-none tracking-wide text-gray-400">
          {label}
        </p>
        <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
          {value || <span className="font-normal text-gray-300">-</span>}
        </p>
      </div>
    </div>
  );
};

export default PerfilInfoRow;
