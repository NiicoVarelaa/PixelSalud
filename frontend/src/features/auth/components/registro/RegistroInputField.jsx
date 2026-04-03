const RegistroInputField = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = "text",
  autoComplete,
  inputMode,
  minLength,
  disabled,
}) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          {icon}
        </div>

        <input
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition duration-200 focus:border-primary-700 focus:outline-none focus:ring focus:ring-primary-600/60 disabled:cursor-not-allowed disabled:bg-slate-50"
          required
          minLength={minLength}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default RegistroInputField;
