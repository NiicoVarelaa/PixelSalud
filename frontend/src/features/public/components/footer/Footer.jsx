import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "@store/useAuthStore";
import apiClient from "@utils/apiClient";

import LogoPixelSalud from "@assets/LogoPixelSalud.webp";
import { Link, NavLink } from "react-router-dom";

import { ASSETS } from "../../../../utils/images";

const FOOTER_LOGOS = [
  { id: "cyberMonday", src: ASSETS.logoFooter, alt: "Cyber Monday" },
  { id: "hotSale", src: ASSETS.logoFooter2, alt: "Hot Sale" },
  { id: "dataFiscal", src: ASSETS.logoFooter3, alt: "Data Fiscal" },
  { id: "cace", src: ASSETS.logoFooter4, alt: "CACE" },
  { id: "vtex", src: ASSETS.logoFooter5, alt: "VTEX" },
  { id: "cruce", src: ASSETS.logoFooter6, alt: "Cruce" },
];

const Footer = () => {
  const { user } = useAuthStore();

  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aceptaMarketing, setAceptaMarketing] = useState(false);

  useEffect(() => {
    const currentEmail = String(user?.email || "")
      .trim()
      .toLowerCase();
    if (currentEmail) {
      setEmail(currentEmail);
    }
  }, [user]);

  useEffect(() => {
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      setIsSubscribed(false);
      return;
    }

    const isAlreadySubscribed =
      localStorage.getItem(`newsletter_subscribed_${normalizedEmail}`) ===
      "true";
    setIsSubscribed(isAlreadySubscribed);
  }, [email]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      toast.error("Por favor, ingresa un email válido.");
      return;
    }

    if (!aceptaMarketing) {
      toast.error("Debes aceptar recibir comunicaciones comerciales.");
      return;
    }

    if (isSubscribed) {
      toast.info("Este email ya está suscrito.");
      return;
    }

    const idCliente = Number(user?.id) || undefined;
    const nombre = user?.nombre || user?.nombreCliente || undefined;

    try {
      setIsSubmitting(true);

      const payload = {
        email: normalizedEmail,
        nombre,
        aceptaMarketing: true,
        fuente: "footer",
      };

      if (idCliente) {
        payload.idCliente = idCliente;
      }

      await apiClient.post("/newsletter/suscripciones", payload);

      localStorage.setItem(`newsletter_subscribed_${normalizedEmail}`, "true");
      setIsSubscribed(true);
      toast.success("¡Gracias por suscribirte a nuestras ofertas!");
    } catch (error) {
      if (error?.response?.status === 409) {
        localStorage.setItem(
          `newsletter_subscribed_${normalizedEmail}`,
          "true",
        );
        setIsSubscribed(true);
        toast.info("Este email ya está suscrito a novedades.");
      } else {
        toast.error("No pudimos registrar tu suscripción. Intenta nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputDisabled = isSubscribed || isSubmitting;
  const buttonDisabled =
    isSubscribed || isSubmitting || !email.trim() || !aceptaMarketing;

  return (
    <div>
      <section className="py-10 sm:pt-16 lg:pt-24 w-full max-w-7xl mx-auto  lg:px-8">
        <div>
          <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
            {/* Logo y redes */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
              <NavLink to="/">
                <img
                  className="w-auto h-9"
                  src={LogoPixelSalud}
                  alt="Logo Pixel Salud"
                />
              </NavLink>
              <p className="text-base leading-relaxed text-gray-700 mt-7">
                Comprometidos con tu bienestar, ofrecemos productos de calidad,
                atención personalizada y el respaldo de profesionales de la
                salud. Gracias por confiar en nosotros.
              </p>
            </div>

            {/* Info */}
            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-800 uppercase">
                Información
              </p>
              <ul className="mt-6 space-y-4">
                <li>
                  <Link
                    to="/sobreNosotros"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Institucional
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sucursales"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Sucursales
                  </Link>
                </li>
              </ul>
            </div>

            {/* Atención al cliente */}
            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-800 uppercase">
                Atención al Cliente
              </p>
              <ul className="mt-6 space-y-4">
                <li>
                  <Link
                    to="/preguntas-frecuentes"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terminos-condiciones"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link
                    to="/legales-promocion"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Legales de Promoción
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
              <p className="text-sm font-semibold tracking-widest text-green-600 uppercase">
                Suscribite para recibir ofertas
              </p>
              <form onSubmit={handleSubscribe} className="mt-6">
                <div className="flex w-full overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-green-600">
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu email"
                    disabled={inputDisabled}
                    className="block h-11 w-3/4 border-0 bg-transparent px-4 text-sm text-gray-700 placeholder-gray-500 caret-green-600 transition-all duration-200 focus:outline-none disabled:bg-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={buttonDisabled}
                    className={`h-11 w-1/4 min-w-[84px] inline-flex items-center justify-center px-2 text-sm font-semibold text-white transition-colors ${
                      buttonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-700 hover:bg-primary-800"
                    }`}
                  >
                    {isSubscribed ? "Subscrito" : "Enviar"}
                  </button>
                </div>

                <label className="mt-3 inline-flex items-start gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={aceptaMarketing}
                    onChange={(e) => setAceptaMarketing(e.target.checked)}
                    disabled={isSubscribed || isSubmitting}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-emerald-600 focus:ring-emerald-600"
                  />
                  Acepto recibir comunicaciones comerciales por email.
                </label>
              </form>
            </div>
          </div>

          <hr className="mt-16 mb-10 border-gray-200" />

          <div className="flex justify-between gap-6 sm:flex-row">
            <div>
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Todos los derechos reservados Pixel
                Salud.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              {FOOTER_LOGOS.map((logo) => (
                <NavLink key={logo.id} to="/error404">
                  <img src={logo.src} alt={logo.alt} loading="lazy" />
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
