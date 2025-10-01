const CategoriaCard = ({categoria, onClick}) => {
  return (
    <div
      className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col items-center justify-center bg-slate-100 hover:bg-secondary-100 transition-colors"
      onClick={onClick}
    >
      <img
        src={categoria.image}
        alt={categoria.text}
        className="transform transition-transform duration-300 max-w-20 group-hover:scale-105"
      />
      <p className="text-sm font-medium text-center">{categoria.text}</p>
    </div>
  );
};

export default CategoriaCard;
