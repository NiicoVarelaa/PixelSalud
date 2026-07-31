import PropTypes from "prop-types";

const PageHeader = ({ title, description }) => {
  return (
    <header className="mb-4 sm:mb-5 shrink-0">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </header>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default PageHeader;
