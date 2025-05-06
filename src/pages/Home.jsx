// src/pages/Home.jsx
import React, { useState } from "react";
import logoImg from "../assets/logo.png"; // 카드에 표시할 이미지

const sections = [
  { title: "상영작", count: 5 },
  { title: "호러", count: 5 },
];

export default function Home() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("🔍 검색어:", query);
    // TODO: 검색 API 호출 or 페이지 이동
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      {/* 검색창 + 버튼 */}
      <div
        className="search-box"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
          margin: "0 auto 2rem",
          maxWidth: "600px",
        }}
      >
        <input
          type="text"
          placeholder="영화 정보를 입력하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className="button" onClick={handleSearch}>
          검색
        </button>
      </div>

      {/* 카드 그리드 */}
      {sections.map(({ title, count }) => (
        <section key={title} style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#fff" }}>{title}</h2>
          <div className="grid">
            {Array.from({ length: count }).map((_, idx) => (
              <div
                className="card"
                key={idx}
                style={{ position: "relative", overflow: "hidden" }}
              >
                <img
                  src={logoImg}
                  alt={title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
