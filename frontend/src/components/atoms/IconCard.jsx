const IconCard = ({ 
  icon, 
  titulo, 
  texto, 
  destacado, 
  bgColor, 
  textColor = "text-gray-600",
  animation = "hover:scale-105 hover:-translate-y-1 transition-all duration-300",
  onClick
}) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full ${animation} hover:shadow-xl cursor-default`}
      onClick={onClick}
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`text-white p-3 rounded-full w-14 h-14 flex items-center justify-center ${bgColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight transition-colors duration-300">
          {titulo}
        </h3>
        <p className={`${textColor} mb-4 flex-grow leading-relaxed`}>{texto}</p>
        <div className="mt-auto pt-4 border-t border-gray-100">
          <p className="font-bold text-sm uppercase tracking-wide text-gray-700 transition-colors duration-300">
            {destacado}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IconCard;