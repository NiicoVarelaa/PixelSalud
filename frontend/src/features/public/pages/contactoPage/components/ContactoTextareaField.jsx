import { MessageSquare } from "lucide-react";
import ContactoFieldError from "./ContactoFieldError";

const ContactoTextareaField = ({ value, onChange, error }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between gap-3">
      <label htmlFor="mensaje" className="block text-sm font-medium text-slate-700">
        Mensaje <span className="text-red-600">*</span>
      </label>
      <span className="text-xs text-slate-500" aria-live="polite">
        {value.length}/1000
      </span>
    </div>

    <div className="relative">
      <MessageSquare className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
      <textarea
        id="mensaje"
        name="mensaje"
        rows="5"
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "mensaje-error" : undefined}
        className={`w-full resize-none rounded-xl border bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary-500/60 ${
          error
            ? "border-red-400 focus-visible:border-red-500"
            : "border-slate-300 focus-visible:border-primary-600"
        }`}
        placeholder="Escribe tu mensaje aquí..."
        maxLength="1000"
      />
    </div>

    <ContactoFieldError id="mensaje-error" message={error} />
  </div>
);

export default ContactoTextareaField;
