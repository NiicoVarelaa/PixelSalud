import { useNavigate } from "react-router-dom";
import { CATEGORIAS_DATA } from "../data/categoriasData";
import CardCategorias from "./CardCategorias";

const Categorias = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoria) => {
    const encodedCategoria = encodeURIComponent(categoria.link);
    const url = `/productos?categoria=${encodedCategoria}`;
    navigate(url);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium mb-8 text-center lg:text-left text-gray-800">CATEGORÍAS</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 sm:gap-6 mt-6">
        {CATEGORIAS_DATA.map((categoria) => (
          <CardCategorias
            key={categoria.text}
            categoria={categoria}
            onClick={() => handleCategoryClick(categoria)}
          />
        ))}
      </div>
    </div>
  );
};

export default Categorias;