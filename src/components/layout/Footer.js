import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#002F6C] text-white text-sm py-8 px-6 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-blue-800 pb-6">
        {/* Logo/Description */}
        <div>
          <h3 className="font-semibold mb-4 text-[#00A1E4]">CINEMA</h3>
          <p className="text-blue-200">
            Enjoy the best cinematic experience with us.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold mb-4 text-[#00A1E4]">Information</h4>
          <ul className="space-y-2 text-blue-300">
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Now Showing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Coming Soon
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Promotions
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
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Cookies
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#00A1E4]">
                Customer Service
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold mb-4 text-[#00A1E4]">Follow Us</h4>
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
        <a
          href="https://github.com/rarubinat"
          className="hover:underline hover:text-[#00A1E4]"
        >
          Alba Rubinat
        </a>{" "}
        | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
