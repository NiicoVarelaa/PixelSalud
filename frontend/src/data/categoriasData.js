import { getCloudinaryUrl } from '../utils/cloudinary';

export const CATEGORIAS_DATA = [
  {
    text: "Fragancias",
    image: getCloudinaryUrl("Fragancias_zkd7fd.webp"),
    link: "Fragancias",
    isPopular: true,
  },
  {
    text: "Belleza",
    image: getCloudinaryUrl("Belleza_vqqnpf.webp") ,
    link: "Belleza",
    isTrending: true,
  },
  {
    text: "Dermocosmética",
    image: getCloudinaryUrl("Dermocosmetica_okgerc.webp"),
    link: "Dermocosmética",
    isOffer: true,
  },
  {
    text: "Cuidado Personal",
    image: getCloudinaryUrl("CuidadoPersonal_sto0at.webp"),
    link: "Cuidado Personal",
  },
  {
    text: "Bebés y Niños",
    image: getCloudinaryUrl("Bebes_ien4ad.webp"),
    link: "Bebes y Niños",
  },
  {
    text: "Nutrición y Deportes",
    image: getCloudinaryUrl("NutriciíonDeportes_wsz2fy.webp"),
    link: "Nutrición y Deportes",
  },
];
