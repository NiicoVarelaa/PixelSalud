import { NavLink } from "react-router-dom";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";
import { NavbarCategoriesDropdown } from "../NavbarCategoriesDropdown";

const NavbarMobilePrimaryLinks = ({
  isCategoriasOpen,
  setIsCategoriasOpen,
  categoriasRef,
  handleCategoriaClick,
  navLinks,
  onCloseMenu,
}) => (
  <>
    <NavbarCategoriesDropdown
      isCategoriasOpen={isCategoriasOpen}
      setIsCategoriasOpen={setIsCategoriasOpen}
      categoriasRef={categoriasRef}
      handleCategoriaClick={handleCategoriaClick}
      mobileMode={true}
    />

    <NavLink
      to="/ofertas"
      onClick={onCloseMenu}
      className={({ isActive }) =>
        `flex items-center gap-2 mb-3 px-1 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
          isActive
            ? "text-primary-700 bg-primary-50"
            : "text-primary-700 hover:text-primary-800 hover:bg-primary-50"
        }`
      }
    >
      <span className="uppercase">Ofertas</span>
      <motion.span
        whileHover={{ scale: 1.18, rotate: 12 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        <Tag className="w-5 h-5 text-primary-700" />
      </motion.span>
    </NavLink>

    {navLinks.map(({ to, label }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onCloseMenu}
        className={({ isActive }) =>
          `block mb-3 px-1 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
            isActive
              ? "text-primary-700 bg-primary-50"
              : "text-gray-700 hover:text-primary-700 hover:bg-gray-50"
          }`
        }
      >
        {label}
      </NavLink>
    ))}
  </>
);

export default NavbarMobilePrimaryLinks;
