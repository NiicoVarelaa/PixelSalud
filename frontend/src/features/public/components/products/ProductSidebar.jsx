import { useProductStore } from "@store/useProductStore";

const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const ProductSidebar = ({
  filtroCategoria,
  updateParams,
  campanaActiva,
  campanaDestacada,
}) => {
  const { categorias } = useProductStore();
  const campaignSidebar = campanaDestacada || campanaActiva;
  const campaignIsActive =
    campaignSidebar &&
    normalizeText(filtroCategoria) ===
      normalizeText(campaignSidebar.nombreCampana);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-3 border-b border-gray-200">
        <h2 className="font-medium text-gray-800 text-sm uppercase">
          Categorías
        </h2>
      </div>
      <div className="p-1">
        <button
          onClick={() => updateParams("categoria", "todos", true)}
          className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-colors cursor-pointer ${
            filtroCategoria === "todos"
              ? "bg-primary-50 text-primary-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Todos
        </button>

        {campaignSidebar && (
          <button
            onClick={() =>
              updateParams("categoria", campaignSidebar.nombreCampana, true)
            }
            className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-colors cursor-pointer ${
              campaignIsActive
                ? "bg-primary-50 text-primary-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {campaignSidebar.nombreCampana}
          </button>
        )}

        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParams("categoria", cat, true)}
            className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-colors ${
              filtroCategoria === cat
                ? "bg-primary-50 text-primary-700 font-medium cursor-pointer"
                : "text-gray-600 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
