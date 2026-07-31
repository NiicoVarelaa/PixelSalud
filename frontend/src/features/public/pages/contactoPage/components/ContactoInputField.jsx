import ContactoFieldError from "./ContactoFieldError";

const ContactoInputField = ({
  id,
  name,
  label,
  icon,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  maxLength,
}) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 block text-sm font-medium text-slate-700"
    >
      {label}
    </label>

    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary-700/50 active:scale-[0.998] ${
          error
            ? "border-red-400 focus-visible:border-red-500"
            : "border-slate-300 focus-visible:border-primary-700"
        }`}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </div>

    <ContactoFieldError id={`${id}-error`} message={error} />
  </div>
);

export default ContactoInputField;
