import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import LogoPixelSalud from "../assets/LogoPixelSalud.webp";
import { Link, NavLink } from "react-router-dom";
import cyberMonday from "../assets/footerImagenes/cyberMonday.webp";
import hotSale from "../assets/footerImagenes/hotSale.webp";
import dataFiscal from "../assets/footerImagenes/dataFiscal.webp";
import cace from "../assets/footerImagenes/cace.webp";
import vtex from "../assets/footerImagenes/vtex.webp";
import cruce from "../assets/footerImagenes/cruce.webp";

const Footer = () => {
  return (
    <div className="">
      <section className="py-10 sm:pt-16 lg:pt-24">
        <div>
          <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
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
                    title="Twitter"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-primary-700 rounded-full w-7 h-7 hover:bg-primary-800 focus:bg-primary-800"
                  >
                    <FaTwitter className="w-4 h-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    title="Facebook"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-primary-700 rounded-full w-7 h-7 hover:bg-primary-800 focus:bg-primary-800"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    title="Instagram"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-primary-700 rounded-full w-7 h-7 hover:bg-primary-800 focus:bg-primary-800"
                  >
                    <FaInstagram className="w-4 h-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/error404"
                    title="Github"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-primary-700 rounded-full w-7 h-7 hover:bg-primary-800 focus:bg-primary-800"
                  >
                    <FaGithub className="w-4 h-4" />
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-800 uppercase">
                Información
              </p>

              <ul className="mt-6 space-y-4">
                <li>
                  <Link
                    to="/error404"
                    title=""
                    className="flex text-base text-gray-500 transition-all duration-200 hover:text-gray-800 focus:text-gray-800"
                  >
                    {" "}
                    Institucional{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/error404"
                    title=""
                    className="flex text-base text-gray-500 transition-all duration-200 hover:text-gray-800 focus:text-gray-800"
                  >
                    {" "}
                    Sucursales{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/error404"
                    title=""
                    className="flex text-base text-gray-500 transition-all duration-200 hover:text-gray-800 focus:text-gray-800"
                  >
                    {" "}
                    Turnos{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/error404"
                    title=""
                    className="flex text-base text-gray-500 transition-all duration-200 hover:text-gray-800 focus:text-gray-800"
                  >
                    {" "}
                    Obra Sociales{" "}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-800 uppercase">
                Atención al Cliente
              </p>

              <ul className="mt-6 space-y-4">
                <li>
                  <Link
                    to="/error404"
                    title=""
                    className="flex text-base text-gray-500 transition-all duration-200 hover:text-gray-800 focus:text-gray-800"
                  >
                    {" "}
                    Preguntas Frecuentes{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/error404"
                    title=""
                    className="flex text-base text-gray-500 transition-all duration-200 hover:text-gray-800 focus:text-gray-800"
                  >
                    {" "}
                    Términos y Condiciones{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/error404"
                    title=""
                    className="flex text-base text-gray-500 transition-all duration-200 hover:text-gray-800 focus:text-gray-800"
                  >
                    {" "}
                    Legales de Promoción{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/error404"
                    title=""
                    className="flex text-base text-gray-500 transition-all duration-200 hover:text-gray-800 focus:text-gray-800"
                  >
                    {" "}
                    Medios de Envíos{" "}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
              <p className="text-sm font-semibold tracking-widest text-green-600 uppercase">
                Subscribete para recibir ofertas
              </p>

              <form action="#" method="POST" className="mt-6">
                <div className="flex w-full">
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Ingresa tu email"
                    className="block w-3/4 p-4 text-gray-600 placeholder-gray-500 transition-all duration-200 border border-gray-400 rounded-l-md focus:outline-none focus:border-green-600 caret-green-600"
                  />
                  <button
                    type="submit"
                    className="w-1/4 inline-flex items-center justify-center px-2 py-4 font-semibold text-white transition-all duration-200 bg-primary-700 rounded-r-md hover:bg-primary-800 focus:bg-primary-800"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <hr className="mt-16 mb-10 border-gray-200" />

          <div className="flex justify-between gap-6 sm:flex-row">
            <div>
              <p className="text-sm text-gray-600">
                © Copyright {new Date().getFullYear()}{" "}
                <span className="text-gray-500 ms-4">
                  Todos los derechos reservados Pixel Salud.
                </span>
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
