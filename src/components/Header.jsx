// src/components/Header.jsx
import React from "react";
import logoImg from "../assets/logo.png"; // 로고 경로

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img
          src={logoImg}
          alt="Movie Talk Logo"
          style={{ height: "100px", objectFit: "contain" }}
        />
      </div>
    </header>
  );
}
