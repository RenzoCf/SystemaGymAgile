import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const NAVBAR_HEIGHT = 70;

export default function PrivateLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: NAVBAR_HEIGHT }}>
        {children}
      </div>
      <Footer />
    </>
  );
}