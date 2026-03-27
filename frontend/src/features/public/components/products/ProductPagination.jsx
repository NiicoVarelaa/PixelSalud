import { ChevronLeft, ChevronRight } from "lucide-react";

export const ProductPagination = ({ paginaActual, totalPaginas, totalProductos, updateParams }) => {
  const productosPorPagina = 12;
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;

  const irAPagina = (numero) => {
    updateParams("pagina", numero);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generarNumerosPagina = () => {
    const numeros = [];
    const maxBotones = 5;

    if (totalPaginas <= maxBotones) {
      for (let i = 1; i <= totalPaginas; i++) numeros.push(i);
    } else {
      if (paginaActual <= 3) {
        for (let i = 1; i <= 4; i++) numeros.push(i);
        numeros.push("...");
        numeros.push(totalPaginas);
      } else if (paginaActual >= totalPaginas - 2) {
        numeros.push(1);
        numeros.push("...");
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) numeros.push(i);
      } else {
        numeros.push(1);
        numeros.push("...");
        numeros.push(paginaActual - 1);
        numeros.push(paginaActual);
        numeros.push(paginaActual + 1);
        numeros.push("...");
        numeros.push(totalPaginas);
      }
    }
    return numeros;
  };

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg border border-gray-200 p-4">
      <div className="text-sm text-gray-600">
        Mostrando {indiceInicio + 1} - {Math.min(indiceFin, totalProductos)} de {totalProductos} productos
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => paginaActual > 1 && irAPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            paginaActual === 1
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-1">
          {generarNumerosPagina().map((numero, index) =>
            numero === "..." ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={numero}
                onClick={() => irAPagina(numero)}
                className={`min-w-10 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  paginaActual === numero
                    ? "bg-primary-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {numero}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => paginaActual < totalPaginas && irAPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            paginaActual === totalPaginas
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};