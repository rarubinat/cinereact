import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#002F6C] text-white text-sm py-8 px-6 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-blue-800 pb-6">
        {/* Logo/Descripción */}
        <div>
          <h3 className="font-semibold mb-4 text-[#00A1E4]">CINEMA</h3>
          <p className="text-blue-200">
            Disfruta de la mejor experiencia cinematográfica con nosotros.
          </p>
        </div>

        {/* Enlaces */}
        <div>
          <h4 className="font-semibold mb-4 text-[#00A1E4]">Información</h4>
          <ul className="space-y-2 text-blue-300">
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Cartelera
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Próximos estrenos
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Promociones
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-4 text-[#00A1E4]">Legal</h4>
          <ul className="space-y-2 text-blue-300">
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Términos y condiciones
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Privacidad
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Cookies
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Atención al cliente
              </a>
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h4 className="font-semibold mb-4 text-[#00A1E4]">Síguenos</h4>
          <div className="flex space-x-4 text-xl text-blue-300">
            <a href="#" className="hover:text-[#00A1E4]">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-[#00A1E4]">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-[#00A1E4]">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-[#00A1E4]">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-blue-300">
        &copy; {new Date().getFullYear()}{" "}
        <a href="https://github.com/rarubinat" className="hover:underline hover:text-[#00A1E4]">
          Alba Rubinat
        </a>{" "}
        | Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
