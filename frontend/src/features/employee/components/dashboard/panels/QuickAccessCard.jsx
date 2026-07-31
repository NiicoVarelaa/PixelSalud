const QuickAccessCard = ({ icon, label, description, color, onClick }) => {
  const Icon = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-gray-200 cursor-pointer text-left"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color.bg} transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={22} className={color.icon} />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
        <p className="mt-0.5 text-[11px] text-gray-400">{description}</p>
      </div>
    </button>
  );
};

export default QuickAccessCard;
