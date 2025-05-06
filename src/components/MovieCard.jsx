// src/components/MovieCard.jsx
import React from "react";

export default function MovieCard({ posterUrl, title }) {
  return (
    <div
      style={{
        background: "#fff",
        color: "#000",
        borderRadius: 8,
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <img
        src={posterUrl || "https://via.placeholder.com/120x180"}
        alt={title}
        style={{ width: "100%", display: "block" }}
      />
      <h4 style={{ margin: "0.5rem", fontSize: "0.9rem" }}>{title}</h4>
    </div>
  );
}
