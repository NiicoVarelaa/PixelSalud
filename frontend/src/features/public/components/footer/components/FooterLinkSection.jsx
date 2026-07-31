import { Link } from "react-router-dom";

const FooterLinkSection = ({ title, links }) => (
  <div>
    <p className="text-sm font-semibold tracking-widest text-gray-800 uppercase">
      {title}
    </p>
    <ul className="mt-6 space-y-4">
      {links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            className="flex cursor-pointer text-base text-gray-500 transition-colors hover:text-gray-800"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterLinkSection;
