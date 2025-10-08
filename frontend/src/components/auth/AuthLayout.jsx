import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side with welcome text */}
      <div className="flex items-center justify-center bg-black w-1/2 px-12 text-white">
        <div className="max-w-md space-y-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to Ecommerce Shopping
          </h1>
          <p className="text-gray-300 text-lg">
            Shop your favorite products with ease and confidence.
          </p>
        </div>
      </div>

      {/* Right side for auth forms (login/register) */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}
