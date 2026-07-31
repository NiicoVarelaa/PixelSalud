const FooterNewsletterForm = ({
  email,
  isSubscribed,
  isSubmitting,
  aceptaMarketing,
  inputDisabled,
  buttonDisabled,
  onEmailChange,
  onAceptaMarketingChange,
  onSubmit,
}) => (
  <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
    <p className="text-sm font-semibold tracking-widest text-green-600 uppercase">
      Suscribite para recibir ofertas
    </p>
    <form onSubmit={onSubmit} className="mt-6">
      <div className="flex w-full overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-green-600">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={onEmailChange}
          placeholder="Ingresa tu email"
          disabled={inputDisabled}
          className="block h-11 w-3/4 border-0 bg-transparent px-4 text-sm text-gray-700 placeholder-gray-500 caret-green-600 transition-all duration-200 focus:outline-none disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={buttonDisabled}
          className={`inline-flex h-11 w-1/4 min-w-[84px] items-center justify-center px-2 text-sm font-semibold text-white transition-colors ${
            buttonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-700 hover:bg-primary-800 cursor-pointer"
          }`}
        >
          {isSubscribed ? "Suscrito" : "Enviar"}
        </button>
      </div>

      <label className="inline-flex items-start gap-2 mt-3 text-xs text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={aceptaMarketing}
          onChange={onAceptaMarketingChange}
          disabled={isSubscribed || isSubmitting}
          className="h-4 w-4 mt-0.5 border-gray-300 rounded cursor-pointer accent-emerald-600 focus:ring-emerald-600"
        />
        Acepto recibir comunicaciones comerciales por email.
      </label>
    </form>
  </div>
);

export default FooterNewsletterForm;
