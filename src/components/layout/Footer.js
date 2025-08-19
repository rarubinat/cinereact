import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black/90 text-white text-sm py-8 px-6 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 border-b pb-6">
        
        {/* Logo/Description */}
        <div>
          <h3 className="font-semibold mb-4">CINEMA</h3>
          <p className="text-white">
            Enjoy the best cinematic experience with us.
          </p>
        </div>

        {/* Company Info */}
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#00A1E4]">About Us</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Work With Us</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Cinema Business</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Customer Service</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Institutional Support</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Transparency</a></li>
          </ul>
        </div>

        {/* Experiences */}
        <div>
          <h4 className="font-semibold mb-4">Experiences</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#00A1E4]">Events</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Luxury Cinemas</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Premium Rooms</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Kids & Schools</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Special Cycles</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Blog</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#00A1E4]">Legal Notice</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Purchase Conditions</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Unlimited Card Terms</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Cookies Policy</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Modern Slavery Statement</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Code of Ethics</a></li>
            <li><a href="#" className="hover:text-[#00A1E4]">Whistleblowing Policy</a></li>
          </ul>
        </div>

        {/* Apps & Social */}
        <div>
          <h4 className="font-semibold mb-4">Get Our App</h4>
          <div className="flex space-x-4 mb-6">
            <a href="#" aria-label="Download on App Store" className="hover:text-[#00A1E4] text-2xl">
              <FaApple />
            </a>
            <a href="#" aria-label="Download on Google Play" className="hover:text-[#00A1E4] text-2xl">
              <FaGooglePlay />
            </a>
          </div>
          <h4 className="font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4 text-xl text-blue-300">
            <a href="#" aria-label="Facebook" className="hover:text-[#00A1E4]"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter" className="hover:text-[#00A1E4]"><FaTwitter /></a>
            <a href="#" aria-label="Instagram" className="hover:text-[#00A1E4]"><FaInstagram /></a>
            <a href="#" aria-label="YouTube" className="hover:text-[#00A1E4]"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-blue-300">
        &copy; {new Date().getFullYear()}{" "}
        <a href="https://github.com/rarubinat" className="hover:underline hover:text-[#00A1E4]">
          Alba Rubinat
        </a>{" "}
        | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
