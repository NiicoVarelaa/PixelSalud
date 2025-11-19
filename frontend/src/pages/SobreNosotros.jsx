import { Link } from "react-router-dom";
import {
  Leaf,
  Stethoscope,
  FlaskConical,
  ShieldCheck,
  HeartPulse,
  HandHeart,
  Award,
  Users,
  Store
} from "lucide-react";
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
    { img: ampollas, texto: "Tecnología Farmacéutica", size: "col-span-1 row-span-1" },
    { img: tienda, texto: "Atención Personalizada", size: "col-span-1 md:col-span-2 row-span-1" },
    { img: deposito, texto: "Stock Permanente", size: "col-span-1 row-span-1" },
    { img: higienePersonal, texto: "Cuidado Personal", size: "col-span-1 row-span-1" },
    { img: mostrador, texto: "Asesoramiento Experto", size: "col-span-1 md:col-span-2 row-span-1" },
    { img: botes, texto: "Análisis Clínicos", size: "col-span-1 row-span-1" }
  ];

  const valores = [
    {
      icono: <Stethoscope size={28} />,
      titulo: "Profesionalismo",
      descripcion: "Equipo farmacéutico certificado con estándares internacionales.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icono: <FlaskConical size={28} />,
      titulo: "Calidad Certificada",
      descripcion: "Control riguroso en la trazabilidad de cada medicamento.",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      icono: <ShieldCheck size={28} />,
      titulo: "Confianza",
      descripcion: "Más de 20 años construyendo seguridad para tu familia.",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icono: <HeartPulse size={28} />,
      titulo: "Bienestar Integral",
      descripcion: "Enfoque preventivo centrado en mejorar tu calidad de vida.",
      color: "bg-rose-50 text-rose-600"
    },
    {
      icono: <Leaf size={28} />,
      titulo: "Sostenibilidad",
      descripcion: "Comprometidos con el medio ambiente y prácticas eco-amigables.",
      color: "bg-amber-50 text-amber-600"
    },
    {
      icono: <HandHeart size={28} />,
      titulo: "Compromiso Social",
      descripcion: "Apoyamos activamente iniciativas de salud en nuestra comunidad.",
      color: "bg-cyan-50 text-cyan-600"
    },
  ];

  const stats = [
    { number: "+20", label: "Años de experiencia", icon: <Award size={20} /> },
    { number: "+15k", label: "Pacientes atendidos", icon: <Users size={20} /> },
    { number: "100%", label: "Garantía de calidad", icon: <ShieldCheck size={20} /> },
    { number: "24/7", label: "Soporte online", icon: <Store size={20} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <MiniBanner />
      <Header />
      
      <main className="flex-grow">
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white -z-10" />
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Sobre Nosotros
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Revolucionando el cuidado de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Salud</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              En Pixel Salud fusionamos la calidez de la atención tradicional con la innovación tecnológica para brindarte una experiencia farmacéutica única.
            </p>
          </div>
        </section>

        <section className="relative z-10 -mt-20 px-6 mb-24">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center text-center px-4">
                  <div className="text-primary-600 mb-2 opacity-80">{stat.icon}</div>
                  <span className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.number}</span>
                  <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 px-6 mb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestra Filosofía</h2>
                  <div className="h-1.5 w-20 bg-primary-500 rounded-full" />
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  En <strong className="text-primary-700 font-semibold">Pixel Salud</strong>, creemos que la farmacia moderna debe ser un centro integral de bienestar. No solo dispensamos medicamentos; construimos relaciones basadas en la empatía y el conocimiento.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Nuestro equipo multidisciplinario trabaja día a día para garantizar que cada paciente reciba el tratamiento adecuado, con un asesoramiento claro y humano. Combinamos 20 años de trayectoria con las últimas herramientas digitales para estar cerca de ti, donde quiera que estés.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-slate-700 font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    Atención Farmacéutica
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-slate-700 font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    Dermocosmética
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-slate-700 font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    Nutrición
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <img 
                    src={ampollas} 
                    alt="Laboratorio" 
                    className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8"
                 />
                 <img 
                    src={tienda} 
                    alt="Atención" 
                    className="rounded-2xl shadow-lg w-full h-64 object-cover"
                 />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Valores que nos definen</h2>
              <p className="text-slate-600 text-lg">
                Los pilares fundamentales que guían cada una de nuestras acciones y decisiones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {valores.map((valor, index) => (
                <div
                  key={index}
                  className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1"
                >
                  <div className={`inline-flex p-4 rounded-xl ${valor.color} mb-6 transition-transform group-hover:scale-110 duration-300`}>
                    {valor.icono}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">
                    {valor.titulo}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {valor.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Nuestras Instalaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-4">
              {imagenes.map((item, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl shadow-md cursor-pointer ${item.size}`}
                >
                  <img
                    src={item.img}
                    alt={item.texto}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-white font-semibold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.texto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary-700 to-primary-900 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Tu bienestar es nuestra prioridad
              </h3>
              <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
                Únete a miles de familias que confían en Pixel Salud. Estamos listos para asesorarte.
              </p>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition-colors duration-300 shadow-lg"
              >
                Contactar con un especialista
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SobreNosotros;