import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaUserMd,
  FaFlask,
  FaShieldAlt,
  FaHeartbeat,
  FaHandHoldingHeart,
} from "react-icons/fa";
import Header from "../components/Header";
import MiniBanner from "../components/MiniBanner";
import Footer from "../components/Footer";
import ampollas from "../assets/ampollas.webp";
import botes from "../assets/botes.webp";
import deposito from "../assets/deposito.webp";
import higienePersonal from "../assets/higienePersonal.webp";
import tienda from "../assets/tienda.webp";
import mostrador from "../assets/mostrador.webp";

const SobreNosotros = () => {
  const imagenes = [
    {
      img: ampollas,
      texto: "Ampollas para inyecciones",
    },
    {
      img: botes,
      texto: "Botes para análisis clínicos",
    },
    {
      img: deposito,
      texto: "Depósito de medicamentos",
    },
    {
      img: higienePersonal,
      texto: "Productos de higiene personal",
    },
    {
      img: tienda,
      texto: "Mostrador de atención",
    },
    {
      img: mostrador,
      texto: "Productos destacados en exhibición",
    },
  ];

  const valores = [
    {
      icono: <FaUserMd className="text-3xl" />,
      titulo: "Profesionalismo",
      descripcion: "Equipo capacitado con estándares médicos internacionales",
    },
    {
      icono: <FaFlask className="text-3xl" />,
      titulo: "Calidad",
      descripcion: "Productos farmacéuticos de primera calidad certificada",
    },
    {
      icono: <FaShieldAlt className="text-3xl" />,
      titulo: "Confianza",
      descripcion: "20 años de experiencia cuidando de nuestra comunidad",
    },
    {
      icono: <FaHeartbeat className="text-3xl" />,
      titulo: "Bienestar",
      descripcion: "Enfoque integral en la salud y calidad de vida",
    },
    {
      icono: <FaLeaf className="text-3xl" />,
      titulo: "Sostenibilidad",
      descripcion: "Comprometidos con prácticas ecoamigables",
    },
    {
      icono: <FaHandHoldingHeart className="text-3xl" />,
      titulo: "Compromiso",
      descripcion:
        "Colaborando con nuestra comunidad y promoviendo hábitos saludables.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <MiniBanner />
      <Header />
      <main className="flex-grow">
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              <span className="text-primary-700">Pixel Salud</span> - Cuidando
              tu bienestar
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Más que una farmacia, tu aliado en salud y calidad de vida
            </p>
          </div>
        </section>

        {/* Sobre Nosotros */}
        <section className="py-4  bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 relative inline-block">
                <span className="relative z-10">Nuestra Filosofía</span>
              </h2>
              <p className="text-gray-500 max-w-3xl mx-auto">
                La esencia de nuestro servicio va más allá de los productos que
                ofrecemos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  En <strong className="text-primary-700">Pixel Salud</strong>{" "}
                  ofrecemos una atención integral orientada al bienestar de
                  nuestros pacientes. Contamos con un equipo de profesionales
                  capacitados que brindan asesoramiento personalizado y humano,
                  enfocado en tus necesidades reales.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Nuestra farmacia combina la tradición del servicio
                  personalizado con la innovación tecnológica, asegurando que
                  cada interacción con nuestros clientes sea excepcional.
                </p>
              </div>
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Ponemos a tu disposición un amplio catálogo de productos
                  farmacéuticos, perfumería, cuidado personal y artículos de
                  bienestar. Nuestra misión es combinar calidad, confianza y
                  tecnología en cada una de nuestras atenciones.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Con más de 20 años en el mercado, hemos construido relaciones
                  duraderas basadas en la transparencia y el cuidado genuino por
                  la salud de nuestra comunidad.
                </p>
              </div>
            </div>

            {/* Nuestros Valores */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                Nuestros Valores
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {valores.map((valor, index) => (
                  <div
                    key={index}
                    className="bg-slate-100 p-6 rounded-xl transition duration-300"
                  >
                    <div className="flex justify-center mb-4 text-secondary-400">
                      {valor.icono}
                    </div>
                    <h4 className="text-lg font-semibold text-center text-gray-800 mb-2">
                      {valor.titulo}
                    </h4>
                    <p className="text-sm text-gray-600 text-center">
                      {valor.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nuestro Espacio */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                Nuestro Espacio
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {imagenes.map((img, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 cursor-pointer relative"
                  >
                    <div className="relative overflow-hidden h-60">
                      <img
                        loading="lazy"
                        src={img.img}
                        alt={img.texto}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                        <p className="text-white font-medium text-lg">
                          {img.texto}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              ¿Listo para experimentar el cuidado{" "}
              <span className="text-primary-700">Pixel Salud</span>?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Visítanos hoy mismo y descubre por qué somos la farmacia de
              confianza de miles de familias
            </p>
            <Link
              to="/contacto"
              className="inline-block bg-primary-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700/90 transition duration-300 shadow-md cursor-pointer"
            >
              Contactar ahora
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SobreNosotros;
