import React from "react";
import { categoryOptionMap, brandOptionMap } from "@/config";
import { Github, Linkedin, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 pt-10 border-t border-gray-300 shadow-md">
      {/* Grid with horizontal padding for centering */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h2 className="text-black font-bold text-xl mb-2">Loop Mart</h2>
          <p className="text-gray-600">
            Loop Mart by <strong>Tayyab Khan</strong> is a modern e-commerce
            platform designed to provide a seamless online shopping experience.
            Browse, shop, and discover a wide range of products with ease and
            security.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-2">Navigation</h3>
          <ul className="space-y-1 text-gray-600">
            <li>
              <a href="/" className="hover:text-black">
                Home
              </a>
            </li>
            <li>
              <a href="/auth/login" className="hover:text-black">
                Sign In
              </a>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-2">Categories</h3>
          <ul className="space-y-1 text-gray-600">
            {Object.keys(categoryOptionMap).map((key) => (
              <li key={key}>
                <a
                  href={`/shop/listing?category=${key}`}
                  className="hover:text-black"
                >
                  {categoryOptionMap[key]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Brands & Connect side by side */}
        <div className="flex justify-between gap-6">
          {/* Brands */}
          <div>
            <h3 className="font-semibold mb-2">Brands</h3>
            <ul className="space-y-1 text-gray-600">
              {Object.keys(brandOptionMap).map((key) => (
                <li key={key}>
                  <a
                    href={`/shop/listing?brand=${key}`}
                    className="hover:text-black"
                  >
                    {brandOptionMap[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-2">Connect</h3>
            <p className="text-gray-600 mb-2">
              <a
                href="mailto:kha9.tayyab@gmail.com"
                className="hover:text-black"
              >
                kha9.tayyab@gmail.com
              </a>
            </p>
            <div className="flex space-x-3 text-gray-600">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center mt-6 mb-10 pt-6">
        <div className="w-1/2 mx-auto border-t border-gray-200"></div>{" "}
        {/* shorter line */}
        <p className="text-gray-500 text-sm mt-2">
          © 2025 Tayyab Khan — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
