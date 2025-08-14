import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineMenuAlt3,
  HiOutlineX,
} from "react-icons/hi";
import Search from "./Search";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Left Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-indigo-600">LOGO</span>
          </Link>
        </div>

        {/* Center Navigation Links - Desktop */}
        <div className="hidden lg:flex space-x-8">
          {["Men", "Women", "Top Wear", "Bottom Wear"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase().replace(" ", "-")}`}
              className="text-gray-700 hover:text-indigo-600 text-sm font-medium uppercase tracking-wider transition-colors duration-200"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right Icons & Search */}
        <div className="flex items-center space-x-6">
          <Link
            to="/account"
            className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
            aria-label="User Account"
          >
            <HiOutlineUser className="w-6 h-6" />
          </Link>
          <Link
            to="/cart"
            className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative"
            aria-label="Shopping Cart"
          >
            <HiOutlineShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-700 hover:text-indigo-600 transition-colors duration-200"
            aria-label="Mobile Menu"
          >
            {menuOpen ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenuAlt3 className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Search */}
          <div className="hidden lg:block">
            <Search />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-3 lg:hidden">
        <Search />
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            {["Men", "Women", "Top Wear", "Bottom Wear"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(" ", "-")}`}
                className="text-gray-700 hover:text-indigo-600 text-sm font-medium uppercase py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
