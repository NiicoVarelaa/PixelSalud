import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SectionHeader = ({ title, subtitle, link, linkText }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-3 h-8 bg-gradient-to-b from-secondary-500 to-secondary-600 rounded-full"></div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h3>
      </div>
      <p className="font-bold text-xl text-secondary-600">
        {subtitle}
      </p>
    </div>
    <Link
      to={link}
      className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105"
    >
      {linkText}
      <ArrowRight className="h-4 w-4" />
    </Link>
  </div>
);

export default SectionHeader;