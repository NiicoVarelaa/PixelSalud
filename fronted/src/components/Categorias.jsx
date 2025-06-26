import { useNavigate } from 'react-router-dom';
import Fragancias from '../assets/Fragancias.png';
import Belleza from '../assets/Belleza.png';
import Dermocosmetica from '../assets/Dermocosmetica.webp';
import MedConReceta from '../assets/MedConReceta.png';
import MedVentaLibre from '../assets/MedVentaLibre.png';
import CuidadoPersonal from '../assets/CuidadoPersonal.png';
import Bebes from '../assets/Bebes.png';

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

  return (
    <div className='mt-12'>
      <p className='text-2xl md:text-3xl font-medium'>Categorías</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6 mt-6'>
        {categories.map((categoria, index) => (
          <div
            key={index}
            className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-secondary-100 transition-colors"
            onClick={() => {
              navigate(`/productos?categoria=${encodeURIComponent(categoria.text)}`);
              scrollTo(0, 0);
            }}
          >
            <img
              src={categoria.image}
              alt={categoria.text}
              className="transform transition-transform duration-200 max-w-20 group-hover:scale-105"
            />
            <p className="text-sm font-medium text-center">{categoria.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categorias;
