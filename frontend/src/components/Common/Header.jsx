import React from "react";
import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header>
      {/* Toopbar  */}
      <Topbar />
      {/* navbar */}
      <Navbar />
      {/* Cart Drawer  */}
    </header>
  );
}
