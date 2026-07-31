import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PerfilFormField = ({
  field,
  value,
  onChange,
  formId,
  inputRef,
  disabled,
  describedBy,
}) => {
  const [showPwd, setShowPwd] = useState(false);
  const inputId = `${formId}-${field.key}`;
  const Icon = field.icon;
  const isPassword = field.type === "password";
  const inputType = isPassword ? (showPwd ? "text" : "password") : field.type;
  const today = new Date().toISOString().slice(0, 10);
  const maxValue = field.max === "today" ? today : field.max;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-700"
      >
        {field.label}
        {field.optional && (
          <span className="text-xs font-normal text-gray-400">(opcional)</span>
        )}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
        )}

        <input
          ref={inputRef}
          id={inputId}
          type={inputType}
          name={field.key}
          value={value}
          onChange={onChange}
          required={field.required === true}
          aria-required={field.required === true}
          aria-describedby={
            describedBy || field.helpText
              ? `${describedBy || ""} ${inputId}-help`.trim()
              : describedBy
          }
          autoComplete={field.autoComplete}
          inputMode={field.inputMode}
          min={field.min}
          max={maxValue}
          maxLength={field.maxLength}
          pattern={field.pattern}
          placeholder={field.placeholder}
          readOnly={field.readOnly === true}
          disabled={disabled}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 text-sm text-slate-900 placeholder:text-slate-300 transition-all duration-150 hover:border-slate-300 focus:border-primary-600 focus:outline-none focus:ring focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          style={{ paddingLeft: Icon ? "2.5rem" : "1rem" }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded text-gray-400 transition-colors hover:text-gray-600 focus-visible:ring focus-visible:ring-primary-500 focus-visible:outline-none"
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {field.helpText && (
        <p id={`${inputId}-help`} className="text-xs text-gray-500">
          {field.helpText}
        </p>
      )}
    </div>
  );
};

export default PerfilFormField;
