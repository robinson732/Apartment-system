import React from "react";
import "../styles/Landing.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} My Property App — Built with ❤️</p>
    </footer>
  );
}
