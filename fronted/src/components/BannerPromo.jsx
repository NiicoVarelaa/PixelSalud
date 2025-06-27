import { NavLink } from "react-router-dom";
import banner1 from "../assets/BannerPromo1.png";
import banner2 from "../assets/BannerPromo2.png";

const BannerPromo = () => {
  return (
    <div className="grid xl:grid-cols-2 gap-6 mt-6 rounded">
      <NavLink to="/productos/">
        <img src={banner1} alt="banner1" className="rounded-lg" />
      </NavLink>

      <NavLink to="/productos">
        <img src={banner2} alt="banner2" className="rounded-lg" />
      </NavLink>
    </div>
  );
};

export default BannerPromo;
