// src/pages/Playlist.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";

export default function Playlist() {
  const navigate = useNavigate();
  // TODO: DB에서 받아올 실제 데이터
  const dummy = [
    { id: 1, title: "호러 모음", author: "작성자A" },
    { id: 2, title: "로맨스 컬렉션", author: "작성자B" },
  ];

  return (
    <section>
      <h1>플레이리스트</h1>
      <button onClick={() => navigate("/playlist/new")}>작성</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {dummy.map((pl) => (
          <li key={pl.id} style={{ margin: "1rem 0" }}>
            <div
              onClick={() => navigate(`/playlist/${pl.id}`)}
              style={{
                background: "#e89393",
                padding: "0.5rem 1rem",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              <strong>{pl.title}</strong> | 작성자: {pl.author}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
