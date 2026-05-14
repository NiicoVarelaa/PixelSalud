const RegistroInputField = ({
  id,
  name,
  label,
  placeholder,
  register,
  icon,
  type = "text",
  autoComplete,
  inputMode,
  disabled,
  error,
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
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={disabled}
          {...register(name)}
          className={`h-11 w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition duration-200 focus:border-primary-700 focus:outline-none focus:ring focus:ring-primary-600/60 disabled:cursor-not-allowed disabled:bg-slate-50 ${
            error ? "border-red-400" : "border-slate-300"
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default RegistroInputField;
