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
      <h2 className="
        text-2xl md:text-3xl 
        font-bold 
        mb-8 
        text-center lg:text-left 
        text-gray-800
        relative
        inline-block
        after:content-['']
        after:block
        after:w-1/3
        after:h-1
        after:bg-gradient-to-r
        after:from-primary-500
        after:to-secondary-500
        after:rounded-full
        after:mt-2
        after:transition-all
        after:duration-300
        hover:after:w-full
        transform
        hover:scale-105
        transition-transform
        duration-300
        cursor-default
      ">
        CATEGORÍAS
      </h2>
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