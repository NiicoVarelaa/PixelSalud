import { ChevronLeft, ChevronRight } from "lucide-react";

const getPaginationNumbers = (paginaActual, totalPaginas) => {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  for (let i = 1; i <= totalPaginas; i++) {
    if (i === 1 || i === totalPaginas || (i >= paginaActual - delta && i <= paginaActual + delta)) {
      range.push(i);
    }
  }
  let prev;
  for (const num of range) {
    if (prev) {
      if (num - prev === 2) rangeWithDots.push(prev + 1);
      else if (num - prev !== 1) rangeWithDots.push("...");
    }
    rangeWithDots.push(num);
    prev = num;
  }
  return rangeWithDots;
};

const VentasPagination = ({ paginaActual, totalPaginas, onPageChange }) => {
  if (totalPaginas <= 1) return null;

  const pages = getPaginationNumbers(paginaActual, totalPaginas);

  return (
    <div className="mt-4 shrink-0">
      <div className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3">
        <nav className="flex justify-center">
          <div className="flex items-center justify-between w-full max-w-md px-1 sm:px-4">
            <button
              onClick={() => onPageChange(Math.max(1, paginaActual - 1))}
              disabled={paginaActual === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 bg-slate-200/50 ${paginaActual === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-300/50 cursor-pointer"}`}
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            <div className="flex items-center gap-2">
              {pages.map((number, index) => {
                if (number === "...") {
                  return (
                    <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm font-medium">...</span>
                  );
                }
                const isActive = number === paginaActual;
                return (
                  <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${isActive ? "text-green-600 border border-green-600" : "text-green-600 hover:bg-green-100 cursor-pointer"}`}
                  >
                    {number}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(Math.min(totalPaginas, paginaActual + 1))}
              disabled={paginaActual === totalPaginas}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 bg-slate-200/50 ${paginaActual === totalPaginas ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-300/50 cursor-pointer"}`}
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default VentasPagination;
