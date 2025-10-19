const CardCategorias = ({ categoria, onClick }) => {
  return (
    <div
      className="
        relative                      
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
      {categoria.isNew && (
        <div 
          className="
            absolute top-2 right-2
            bg-secondary-100 px-3 py-1               
            border-2 border-blue-500         
            rounded-full
            text-blue-500 font-bold text-sm  
            z-10                             
          "
        >
          ¡NUEVO!
        </div>
      )}

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