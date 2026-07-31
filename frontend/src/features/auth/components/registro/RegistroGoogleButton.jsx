const RegistroGoogleButton = ({ onClick }) => {
  return (
    <>
      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        o con google
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={onClick}
        className="group inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.29h6.45a5.52 5.52 0 0 1-2.39 3.63v3.02h3.87c2.26-2.08 3.56-5.15 3.56-8.67z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3.02c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.76-2.11-6.7-4.95H1.3v3.11A11.99 11.99 0 0 0 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.3 14.28A7.2 7.2 0 0 1 4.92 12c0-.79.14-1.55.38-2.28V6.61H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.39l4-3.11z"
          />
          <path
            fill="#EA4335"
            d="M12 4.77c1.76 0 3.34.6 4.58 1.77l3.43-3.43C17.94 1.17 15.24 0 12 0A11.99 11.99 0 0 0 1.3 6.61l4 3.11c.94-2.84 3.58-4.95 6.7-4.95z"
          />
        </svg>
        Continuar con Google
      </button>
    </>
  );
};

export default RegistroGoogleButton;
