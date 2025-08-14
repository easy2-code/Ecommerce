import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaShippingFast,
  FaPhoneAlt,
  FaGlobeAmericas,
} from "react-icons/fa";

export default function Topbar() {
  return (
    <div className="bg-white text-gray-800 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-3">
          {/* Left Section - Social Links */}
          <div className="flex items-center space-x-4 mb-3 md:mb-0">
            <span className="hidden md:inline-block text-sm font-medium">
              Follow us:
            </span>
            <div className="flex space-x-3">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-sky-400 transition-colors"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaPinterestP className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Middle Section - Shipping Info */}
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full mb-3 md:mb-0">
            <FaShippingFast className="text-blue-600 mr-2" />
            <span className="text-sm font-medium">
              Free Worldwide Shipping | 30-Day Returns
            </span>
          </div>

          {/* Right Section - Contact */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center group">
              <FaGlobeAmericas className="text-gray-500 mr-2 group-hover:text-blue-600 transition-colors" />
              <span className="text-sm group-hover:text-blue-600 transition-colors cursor-pointer">
                English / USD
              </span>
            </div>
            <div className="flex items-center group">
              <FaPhoneAlt className="text-gray-500 mr-2 group-hover:text-blue-600 transition-colors" />
              <a
                href="tel:+1234567890"
                className="text-sm group-hover:text-blue-600 transition-colors"
              >
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
