import { memo } from "react";
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

const GALLERY_ITEMS = [
  { id: 1, img: ampollas, alt: "Tecnología Farmacéutica", className: "col-span-1" },
  { id: 2, img: tienda, alt: "Atención Personalizada", className: "col-span-1 md:col-span-2 lg:col-span-2" },
  { id: 3, img: deposito, alt: "Stock Permanente", className: "col-span-1" },
  { id: 4, img: higienePersonal, alt: "Cuidado Personal", className: "col-span-1" },
  { id: 5, img: mostrador, alt: "Asesoramiento Experto", className: "col-span-1 md:col-span-2 lg:col-span-2" },
  { id: 6, img: botes, alt: "Análisis Clínicos", className: "col-span-1" },
];

const VALUES_DATA = [
  {
    icon: Stethoscope, 
    title: "Profesionalismo",
    description: "Equipo farmacéutico certificado con estándares internacionales.",
    colorClass: "bg-blue-50 text-blue-600 border-blue-100"
  },
  {
    icon: FlaskConical,
    title: "Calidad Certificada",
    description: "Control riguroso en la trazabilidad de cada medicamento.",
    colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100"
  },
  {
    icon: ShieldCheck,
    title: "Confianza",
    description: "Más de 20 años construyendo seguridad para tu familia.",
    colorClass: "bg-purple-50 text-purple-600 border-purple-100"
  },
  {
    icon: HeartPulse,
    title: "Bienestar Integral",
    description: "Enfoque preventivo centrado en mejorar tu calidad de vida.",
    colorClass: "bg-rose-50 text-rose-600 border-rose-100"
  },
  {
    icon: Leaf,
    title: "Sostenibilidad",
    description: "Comprometidos con el medio ambiente y prácticas eco-amigables.",
    colorClass: "bg-amber-50 text-amber-600 border-amber-100"
  },
  {
    icon: HandHeart,
    title: "Compromiso Social",
    description: "Apoyamos activamente iniciativas de salud en nuestra comunidad.",
    colorClass: "bg-cyan-50 text-cyan-600 border-cyan-100"
  },
];

const STATS_DATA = [
  { id: 1, number: "+20", label: "Años de experiencia", Icon: Award },
  { id: 2, number: "+15k", label: "Pacientes atendidos", Icon: Users },
  { id: 3, number: "100%", label: "Garantía de calidad", Icon: ShieldCheck },
  { id: 4, number: "24/7", label: "Soporte online", Icon: Store },
];

const HeroSection = memo(function HeroSection() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-primary-50/60 to-white -z-10" aria-hidden="true" />
      <div className="max-w-5xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
        Revolucionando el cuidado de tu <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">Salud</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        En Pixel Salud fusionamos la calidez de la atención tradicional con la innovación tecnológica para brindarte una experiencia única.
      </p>
    </div>
  </section>
  );
});

const StatsSection = memo(function StatsSection() {
  return (
    <section className="relative z-10 -mt-24 mb-24">
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
        {STATS_DATA.map(({ id, number, label, Icon }) => (
          <div key={id} className="flex flex-col items-center text-center px-2 md:px-4 group">
            <div className="text-primary-600 mb-3 opacity-80 group-hover:scale-110 transition-transform duration-300 bg-primary-50 p-2 rounded-lg">
              <Icon size={20} />
            </div>
            <span className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">{number}</span>
            <span className="text-xs md:text-sm text-slate-500 font-semibold uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
});

const PhilosophySection = memo(function PhilosophySection() {
  return (
    <section className="py-12 mb-24">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 relative inline-block">
              Nuestra Filosofía
              <span className="absolute -bottom-2 left-0 w-1/3 h-1.5 bg-primary-500 rounded-full" aria-hidden="true"></span>
            </h2>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed">
            En <strong className="text-primary-700 font-semibold">Pixel Salud</strong>, creemos que la farmacia moderna debe ser un centro integral de bienestar. No solo dispensamos medicamentos; construimos relaciones basadas en la empatía.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Combinamos 20 años de trayectoria con las últimas herramientas digitales para estar cerca de ti, donde quiera que estés.
          </p>
          
          <div className="flex flex-wrap gap-3 pt-2">
            {["Atención Farmacéutica", "Dermocosmética", "Nutrición"].map((tag) => (
              <div key={tag} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-700 font-medium text-sm hover:bg-slate-100 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative">
            <div className="absolute -inset-4 bg-primary-100/50 rounded-full blur-3xl -z-10 opacity-50" aria-hidden="true" />
            <img 
              src={ampollas} 
              alt="Laboratorio farmacéutico" 
              loading="lazy"
              className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8 hover:-translate-y-2 transition-transform duration-500"
            />
            <img 
              src={tienda} 
              alt="Atención al cliente" 
              loading="lazy"
              className="rounded-2xl shadow-lg w-full h-64 object-cover hover:translate-y-2 transition-transform duration-500"
            />
        </div>
      </div>
    </div>
  </section>
  );
});

const ValuesSection = memo(function ValuesSection() {
  return (
    <section className="py-20 bg-slate-50/80">
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Valores que nos definen</h2>
        <p className="text-slate-600 text-lg">
          Los pilares fundamentales que guían cada una de nuestras acciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {VALUES_DATA.map(({ title, description, colorClass, icon: Icon }) => (
          <div
            key={title}
            className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-2"
          >
            <div className={`inline-flex p-4 rounded-xl ${colorClass} border mb-6 transition-transform group-hover:scale-110 duration-300`}>
              <Icon size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors">
              {title}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
});

const InstallationsGallery = memo(function InstallationsGallery() {
  return (
    <section className="py-24 w-full">
      <div className="max-w-[1920px] mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">Nuestras Instalaciones</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[250px] gap-4">
        {GALLERY_ITEMS.map(({ id, img, alt, className }) => (
          <div
            key={id}
            className={`group relative overflow-hidden rounded-2xl shadow-md cursor-pointer ${className}`}
          >
            <img
              src={img}
              alt={alt}
              loading="lazy" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <p className="text-white font-bold text-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">
                {alt}
              </p>
              <div className="h-1 w-12 bg-primary-500 rounded-full mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
});

const CTASection = memo(function CTASection() {
  return (
    <section className="py-20">
    <div className="max-w-5xl mx-auto bg-linear-to-r from-primary-700 to-primary-900 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px]" aria-hidden="true"></div>
      
      <div className="relative z-10">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Tu bienestar es nuestra prioridad
        </h3>
        <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
          Únete a miles de familias que confían en Pixel Salud. Estamos listos para asesorarte.
        </p>
        <Link
          to="/contacto"
          className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Contactar con un especialista
        </Link>
      </div>
    </div>
  </section>
  );
});

const SobreNosotros = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <MiniBanner />
      <Header />
      
      <main className="grow">
        <HeroSection />
        <StatsSection />
        <PhilosophySection />
        <ValuesSection />
        <InstallationsGallery />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default SobreNosotros;