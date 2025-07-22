import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white text-sm py-8 px-6 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-6">
        {/* Logo/Descripción */}
        <div>
          <h3 className="font-semibold mb-4">CINEMA</h3>
          <p className="text-gray-400">Disfruta de la mejor experiencia cinematográfica con nosotros.</p>
        </div>

        {/* Enlaces */}
        <div>
          <h4 className="font-semibold mb-4">Información</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:underline">Cartelera</a></li>
            <li><a href="#" className="hover:underline">Próximos estrenos</a></li>
            <li><a href="#" className="hover:underline">Promociones</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:underline">Términos y condiciones</a></li>
            <li><a href="#" className="hover:underline">Privacidad</a></li>
            <li><a href="#" className="hover:underline">Cookies</a></li>
            <li><a href="#" className="hover:underline">Atención al cliente</a></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h4 className="font-semibold mb-4">Síguenos</h4>
          <div className="flex space-x-4 text-xl text-gray-400">
            <a href="#" className="hover:text-yellow-400"><FaFacebookF /></a>
            <a href="#" className="hover:text-yellow-400"><FaTwitter /></a>
            <a href="#" className="hover:text-yellow-400"><FaInstagram /></a>
            <a href="#" className="hover:text-yellow-400"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500">
        &copy; {new Date().getFullYear()} <a href="https://github.com/rarubinat" className="hover:underline">Alba Rubinat</a> | Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
