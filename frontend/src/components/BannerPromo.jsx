import { NavLink } from "react-router-dom";
import banner1 from "../assets/BannerPromo1.png";
import banner2 from "../assets/BannerPromo2.png";

const BannerPromo = () => {
  const altBanner1 = "Dermocosmética";
  const altBanner2 = "Cuidado Personal";

  return (
    <div className="grid xl:grid-cols-2 gap-6 mt-12 rounded">
      <NavLink to={`/productos?categoria=${altBanner1}`}>
        <img src={banner1} alt={altBanner1} className="rounded-lg" />
      </NavLink>

      <NavLink to={`/productos?categoria=${altBanner2}`}>
        <img src={banner2} alt={altBanner2} className="rounded-lg" />
      </NavLink>
    </div>
  );
};

export default BannerPromo;
