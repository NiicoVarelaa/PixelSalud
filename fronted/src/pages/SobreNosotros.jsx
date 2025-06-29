const SobreNosotros = () => {
  const imagenes = [
    {
      url: 'ampollas para inyecciones.jpg',
      texto: 'Ampollas para inyecciones'
    },
    {
      url: 'botes para analisis.jpg',
      texto: 'Botes para análisis clínicos'
    },
    {
      url: 'deposito.jpg',
      texto: 'Depósito de medicamentos'
    },
    {
      url: 'higiene personal.jpg',
      texto: 'Productos de higiene personal'
    },
    {
      url: 'mostrador.jpg',
      texto: 'Mostrador de atención'
    },
    {
      url: 'productos en el mostrador.jpg',
      texto: 'Productos destacados en exhibición'
    }
  ];

  return (
    <div className="bg-gray-100 px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-10">Sobre Nosotros</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 leading-relaxed mb-12 max-w-5xl mx-auto">
        <p>
          En <strong className="text-green-700">Pixel Salud</strong> ofrecemos una atención integral orientada al bienestar de nuestros pacientes. Contamos con un equipo de profesionales capacitados que brindan asesoramiento personalizado y humano, enfocado en tus necesidades reales.
        </p>
        <p>
          Ponemos a tu disposición un amplio catálogo de productos farmacéuticos, perfumería, cuidado personal y artículos de bienestar. Nuestra misión es combinar calidad, confianza y tecnología en cada una de nuestras atenciones.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {imagenes.map((img, index) => (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transform hover:scale-[1.03] transition duration-300 cursor-pointer"
          >
            <img
              src={img.url}
              alt={img.texto}
              className="w-full h-48 object-cover"
            />
            <p className="p-3 text-sm text-center font-medium text-gray-800">{img.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SobreNosotros;
