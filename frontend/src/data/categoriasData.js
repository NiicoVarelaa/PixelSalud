import Fragancias from '../assets/Fragancias.webp';
import Belleza from '../assets/Belleza.webp';
import Dermocosmetica from '../assets/Dermocosmetica.webp';
import MedConReceta from '../assets/MedConReceta.webp';
import MedVentaLibre from '../assets/MedVentaLibre.webp';
import CuidadoPersonal from '../assets/CuidadoPersonal.webp';
import Bebes from '../assets/Bebes.webp';

export const CATEGORIAS_DATA = [
  { 
    text: 'Fragancias', 
    image: Fragancias, 
    link: 'Fragancias', 
    isPopular: true 
  },
  { 
    text: 'Belleza', 
    image: Belleza, 
    link: 'Belleza', 
    isTrending: true
  },
  { 
    text: 'Dermocosmética', 
    image: Dermocosmetica, 
    link: 'Dermocosmética', 
    isOffer: true 
  },
  { 
    text: 'Medicamentos con Receta', 
    image: MedConReceta, 
    link: 'Medicamentos con Receta', 
    isNew: true 
  },
  { 
    text: 'Medicamentos Venta Libre', 
    image: MedVentaLibre, 
    link: 'Medicamentos Venta Libre', 

  },
  { 
    text: 'Cuidado Personal', 
    image: CuidadoPersonal, 
    link: 'Cuidado Personal', 
  },
  { 
    text: 'Bebés y Niños', 
    image: Bebes, 
    link: 'Bebes y Niños',
  },
];