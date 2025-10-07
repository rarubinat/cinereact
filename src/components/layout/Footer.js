import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";

// Footer component - provides site-wide navigation, app download links, and social media icons
const Footer = () => {
  return (
    // Main footer container with dark background and white text
    <footer className="bg-black/90 text-white text-sm py-8 px-6 w-full">

      {/* 
        Main layout: uses a responsive grid.
        - On small screens: single column layout.
        - On medium+ screens: 5 columns.
      */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 border-b pb-6">
        
        {/* 
          Column 1: Brand section
          Displays the site name and a short description.
        */}
        <div>
          <h3 className="font-semibold mb-4">CINEMA</h3>
          <p>
            Enjoy the best cinematic experience with us.
          </p>
        </div>

        {/* 
          Column 2: Company information links
          Contains links to corporate and customer service pages.
        */}
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Work With Us</a></li>
            <li><a href="#">Cinema Business</a></li>
            <li><a href="#">Customer Service</a></li>
            <li><a href="#">Institutional Support</a></li>
            <li><a href="#">Transparency</a></li>
          </ul>
        </div>

        {/* 
          Column 3: Experiences links
          Highlights special cinema-related activities and categories.
        */}
        <div>
          <h4 className="font-semibold mb-4">Experiences</h4>
          <ul className="space-y-2">
            <li><a href="#">Events</a></li>
            <li><a href="#">Luxury Cinemas</a></li>
            <li><a href="#">Premium Rooms</a></li>
            <li><a href="#">Kids & Schools</a></li>
            <li><a href="#">Special Cycles</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        {/* 
          Column 4: Legal links
          Lists all the required legal and compliance-related pages.
        */}
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#">Legal Notice</a></li>
            <li><a href="#">Purchase Conditions</a></li>
            <li><a href="#">Unlimited Card Terms</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cookies Policy</a></li>
            <li><a href="#">Modern Slavery Statement</a></li>
            <li><a href="#">Code of Ethics</a></li>
            <li><a href="#">Whistleblowing Policy</a></li>
          </ul>
        </div>

        {/* 
          Column 5: App download and social media section
          Includes mobile app store buttons and links to social networks.
        */}
        <div>
          {/* App download section */}
          <h4 className="font-semibold mb-4">Get Our App</h4>
          <div className="flex space-x-4 mb-6">
            {/* App Store link */}
            <a href="#" aria-label="Download on App Store" className="text-2xl">
              <FaApple />
            </a>
            {/* Google Play link */}
            <a href="#" aria-label="Download on Google Play" className="text-2xl">
              <FaGooglePlay />
            </a>
          </div>

          {/* Social media links section */}
          <h4 className="font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4 text-xl">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* 
        Bottom section of the footer.
        Displays the current year and credits.
      */}
      <div className="mt-6 text-center">
        &copy; {new Date().getFullYear()}{" "}
        <a href="https://github.com/rarubinat" className="hover:underline">
          Alba Rubinat
        </a>{" "}
        | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
