const CardCategorias = ({ categoria, onClick }) => {
  return (
    <div
      className="
        group cursor-pointer 
        py-6 px-4                     
        rounded-xl 
        flex flex-col items-center justify-center 
        gap-3                         
        bg-white border-2 border-gray-100                
        hover:shadow-xl               
        hover:border-primary-700    
        transition-all duration-300
      "
      onClick={onClick}
    >
      <img
        src={categoria.image}
        alt={categoria.text}
        className="
          transform transition-transform duration-300 
          max-w-24                      
          group-hover:scale-110
          object-contain 
        "
      />
      <p
        className="
        text-sm font-semibold text-gray-800 
        text-center 
        group-hover:text-primary-700 
      "
      >
        {categoria.text}
      </p>
    </div>
  );
};

export default CardCategorias;
