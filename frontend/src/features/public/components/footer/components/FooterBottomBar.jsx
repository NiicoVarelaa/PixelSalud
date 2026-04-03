import { NavLink } from "react-router-dom";

const FooterBottomBar = ({ currentYear, logos }) => (
  <div className="flex justify-between gap-6 sm:flex-row">
    <div>
      <p className="text-sm text-gray-600">
        © {currentYear} Todos los derechos reservados Pixel Salud.
      </p>
    </div>
    <div className="flex items-center justify-center gap-4">
      {logos.map((logo) => (
        <NavLink key={logo.id} to="/error404" className="cursor-pointer">
          <img src={logo.src} alt={logo.alt} loading="lazy" />
        </NavLink>
      ))}
    </div>
  </div>
);

export default FooterBottomBar;
