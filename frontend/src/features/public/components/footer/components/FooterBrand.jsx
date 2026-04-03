import LogoPixelSalud from "@assets/LogoPixelSalud.webp";
import { NavLink } from "react-router-dom";

const FooterBrand = () => (
  <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
    <NavLink to="/" className="cursor-pointer">
      <img className="h-9 w-auto" src={LogoPixelSalud} alt="Logo Pixel Salud" />
    </NavLink>
    <p className="mt-7 text-base leading-relaxed text-gray-700">
      Comprometidos con tu bienestar, ofrecemos productos de calidad, atención
      personalizada y el respaldo de profesionales de la salud. Gracias por
      confiar en nosotros.
    </p>
  </div>
);

export default FooterBrand;
