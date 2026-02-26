import { NavLink } from "react-router-dom";

export function NavbarLinks({ navLinks }) {
  return navLinks.map(({ to, label }) => (
    <NavLink
      key={to}
      to={to}
      className="cursor-pointer flex items-center px-3 py-1.5 rounded-lg font-medium align-middle transition-all duration-200 hover:text-primary-700"
      aria-label={label}
      tabIndex={0}
    >
      {({ isActive }) => (
        <span className={isActive ? "text-primary-700" : ""}>{label}</span>
      )}
    </NavLink>
  ));
}
