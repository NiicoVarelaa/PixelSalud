import Header from "@features/public/components/navigation/Header";
import Footer from "@features/public/components/footer/Footer";
import MiniBanner from "@features/public/components/banners/MiniBanner";
import {
  CTASection,
  HeroSection,
  InstallationsGallery,
  PhilosophySection,
  StatsSection,
  ValuesSection,
} from "./sobreNosotrosPage";

const SobreNosotros = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <MiniBanner />
      <Header />
      <a
        href="#sobre-nosotros-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-700"
      >
        Saltar al contenido principal
      </a>

      <main
        id="sobre-nosotros-main"
        className="mx-auto w-full max-w-7xl grow px-4 pb-8 sm:px-6 lg:px-8"
      >
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
