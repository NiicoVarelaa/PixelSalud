import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import LogoPixelSalud from "../assets/LogoPixelSalud.webp";
import { Link, NavLink } from "react-router-dom";
import cyberMonday from "../assets/footerImagenes/cyberMonday.webp";
import hotSale from "../assets/footerImagenes/hotSale.webp";
import dataFiscal from "../assets/footerImagenes/dataFiscal.webp";
import cace from "../assets/footerImagenes/cace.webp";
import vtex from "../assets/footerImagenes/vtex.webp";
import cruce from "../assets/footerImagenes/cruce.webp";

const getCliente = async () => {
  try {
    const usuariosResponse = await axios.get("http://localhost:5000/clientes");
    const usuarios = usuariosResponse.data;
    const usuarioLogueado = usuarios.find((user) => user.logueado === 1);
    return usuarioLogueado || null;
  } catch (error) {
    console.error("Error al obtener el usuario logueado: " + error);
    return null;
  }
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [usuarioEmail, setUsuarioEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const cliente = await getCliente();

      if (cliente) {
        setUsuarioEmail(cliente.email);
        const isAlreadySubscribed = localStorage.getItem(
          `subscribed_${cliente.email}`
        );
        setIsSubscribed(isAlreadySubscribed === "true");
      } else {
        setUsuarioEmail("");
        setIsSubscribed(false);
        setEmail(""); 
      }
    };

    fetchUserEmail();
  });

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!usuarioEmail) {
      toast.error("Debes iniciar sesión para suscribirte.");
      return;
    }

    if (!email.trim()) {
      toast.error("Por favor, ingresa un email.");
      return;
    }

    if (email !== usuarioEmail) {
      toast.error("Solo puedes suscribirte con el email de tu cuenta.");
      return;
    }

    toast.success("¡Gracias por suscribirte!");
    setIsSubscribed(true);
    setEmail("");

    localStorage.setItem(`subscribed_${usuarioEmail}`, "true");
  };

  return (
    <div>
      <section className="py-10 sm:pt-16 lg:pt-24">
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
              <ul className="flex items-center space-x-3 mt-9">
                <li>
                  <Link
                    to="/error404"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-primary-700 rounded-full w-7 h-7 hover:bg-primary-800"
                  >
                    <FaTwitter className="w-4 h-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-primary-700 rounded-full w-7 h-7 hover:bg-primary-800"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-primary-700 rounded-full w-7 h-7 hover:bg-primary-800"
                  >
                    <FaInstagram className="w-4 h-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-primary-700 rounded-full w-7 h-7 hover:bg-primary-800"
                  >
                    <FaGithub className="w-4 h-4" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-800 uppercase">
                Información
              </p>
              <ul className="mt-6 space-y-4">
                <li>
                  <Link
                    to="/error404"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Institucional
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Sucursales
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Turnos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Obra Sociales
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
                    to="/error404"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Legales de Promoción
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    className="flex text-base text-gray-500 hover:text-gray-800"
                  >
                    Medios de Envíos
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
              <p className="text-sm font-semibold tracking-widest text-green-600 uppercase">
                Subscribete para recibir ofertas
              </p>
              <form onSubmit={handleSubscribe} className="mt-6">
                <div className="flex w-full">
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={isSubscribed ? usuarioEmail : email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      !usuarioEmail
                        ? "Inicia sesión para suscribirte"
                        : "Ingresa tu email"
                    }
                    disabled={isSubscribed || !usuarioEmail}
                    className="block w-3/4 p-4 text-gray-600 placeholder-gray-500 transition-all duration-200 border border-gray-400 rounded-l-md focus:outline-none focus:border-green-600 caret-green-600 disabled:bg-gray-200"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribed || !usuarioEmail}
                    className={`w-1/4 inline-flex items-center justify-center px-2 py-4 font-semibold text-white rounded-r-md ${
                      isSubscribed || !usuarioEmail
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-700 hover:bg-primary-800"
                    }`}
                  >
                    {isSubscribed ? "Subscrito" : "Enviar"}
                  </button>
                </div>
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
              <NavLink to="/error404">
                <img src={cyberMonday} alt="cyberMonday" />
              </NavLink>
              <NavLink to="/error404">
                <img src={hotSale} alt="hotSale" />
              </NavLink>
              <NavLink to="/error404">
                <img src={dataFiscal} alt="dataFiscal" />
              </NavLink>
              <NavLink to="/error404">
                <img src={cace} alt="cace" />
              </NavLink>
              <NavLink to="/error404">
                <img src={vtex} alt="vtex" />
              </NavLink>
              <NavLink to="/error404">
                <img src={cruce} alt="cruce" />
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
