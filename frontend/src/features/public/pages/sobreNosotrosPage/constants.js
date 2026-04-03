import {
  Award,
  FlaskConical,
  HandHeart,
  HeartPulse,
  Leaf,
  ShieldCheck,
  Stethoscope,
  Store,
  Users,
} from "lucide-react";
import { ASSETS } from "../../../../utils/images";

export const SOBRE_NOSOTROS_REVEAL_UP = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" },
};

export const EXPERTISE_TAGS = [
  "Atención Farmacéutica",
  "Dermocosmética",
  "Nutrición",
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    img: ASSETS.sobreNosotros,
    alt: "Tecnología Farmacéutica",
    className: "col-span-1",
  },
  {
    id: 2,
    img: ASSETS.sobreNosotros2,
    alt: "Atención Personalizada",
    className: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: 3,
    img: ASSETS.sobreNosotros3,
    alt: "Stock Permanente",
    className: "col-span-1",
  },
  {
    id: 4,
    img: ASSETS.sobreNosotros4,
    alt: "Cuidado Personal",
    className: "col-span-1",
  },
  {
    id: 5,
    img: ASSETS.sobreNosotros5,
    alt: "Asesoramiento Experto",
    className: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: 6,
    img: ASSETS.sobreNosotros6,
    alt: "Análisis Clínicos",
    className: "col-span-1",
  },
];

export const PHILOSOPHY_IMAGES = {
  primary: ASSETS.sobreNosotros,
  secondary: ASSETS.sobreNosotros6,
};

export const STATS_DATA = [
  { id: 1, number: "+20", label: "Años de experiencia", icon: Award },
  { id: 2, number: "+15k", label: "Pacientes atendidos", icon: Users },
  { id: 3, number: "100%", label: "Garantía de calidad", icon: ShieldCheck },
  { id: 4, number: "24/7", label: "Soporte online", icon: Store },
];

export const VALUES_DATA = [
  {
    icon: Stethoscope,
    title: "Profesionalismo",
    description:
      "Equipo farmacéutico certificado con estándares internacionales.",
    colorClass: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: FlaskConical,
    title: "Calidad Certificada",
    description: "Control riguroso en la trazabilidad de cada medicamento.",
    colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: ShieldCheck,
    title: "Confianza",
    description: "Más de 20 años construyendo seguridad para tu familia.",
    colorClass: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    icon: HeartPulse,
    title: "Bienestar Integral",
    description: "Enfoque preventivo centrado en mejorar tu calidad de vida.",
    colorClass: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    icon: Leaf,
    title: "Sostenibilidad",
    description:
      "Comprometidos con el medio ambiente y prácticas eco-amigables.",
    colorClass: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    icon: HandHeart,
    title: "Compromiso Social",
    description:
      "Apoyamos activamente iniciativas de salud en nuestra comunidad.",
    colorClass: "bg-cyan-50 text-cyan-600 border-cyan-100",
  },
];
