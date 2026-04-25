export const DateInput = ({ id, label, value, onChange }) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        type="date"
        id={id}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full min-h-9 rounded-lg border border-slate-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500"
      />
    </div>
  );
};