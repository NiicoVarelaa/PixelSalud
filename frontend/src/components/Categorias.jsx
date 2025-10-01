import { useNavigate } from 'react-router-dom';
import Fragancias from '../assets/Fragancias.webp';
import Belleza from '../assets/Belleza.webp';
import Dermocosmetica from '../assets/Dermocosmetica.webp';
import MedConReceta from '../assets/MedConReceta.webp';
import MedVentaLibre from '../assets/MedVentaLibre.webp';
import CuidadoPersonal from '../assets/CuidadoPersonal.webp';
import Bebes from '../assets/Bebes.webp';
import CategoriaCard from './CategoriaCard';

const categories = [
  { text: 'Fragancias', image: Fragancias },
  { text: 'Belleza', image: Belleza },
  { text: 'Dermocosmética', image: Dermocosmetica },
  { text: 'Medicamentos con Receta', image: MedConReceta },
  { text: 'Medicamentos venta Libre', image: MedVentaLibre },
  { text: 'Cuidado Personal', image: CuidadoPersonal },
  { text: 'Bebés y Niños', image: Bebes },
];

const Categorias = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryText) => {
    navigate(`/productos?categoria=${encodeURIComponent(categoryText)}`);
    scrollTo(0, 0);
  };

  return (
    <div className='mt-12'>
      <p className='text-2xl md:text-3xl font-medium'>Categorías</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6 mt-6'>
        {categories.map((categoria) => (
          <CategoriaCard
            key={categoria.text}
            categoria={categoria}
            onClick={() => handleCategoryClick(categoria.text)}
          />
        ))}
      </div>
    </div>
  );
};

export default Categorias;