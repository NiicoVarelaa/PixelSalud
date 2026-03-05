import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Tag } from "lucide-react";

export function NavbarOffersLink() {
  return (
    <li>
      <NavLink
        to="/productos?categoria=Ofertas"
        className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium align-middle transition-all duration-200 group text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400`}
        aria-label="Ofertas"
        tabIndex={0}
      >
        {({ isActive }) => (
          <>
            <motion.span
              whileHover={{ scale: 1.18, rotate: 12 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex items-center"
            >
              <Tag
                className={`w-5 h-5 transition-colors duration-200 text-primary-700 group-hover:text-primary-800`}
              />
            </motion.span>
            <span
              className={
                isActive ? "text-primary-700" : "group-hover:text-primary-800"
              }
            >
              OFERTAS
            </span>
          </>
        )}
      </NavLink>
    </li>
  );
}
