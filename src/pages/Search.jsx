// src/components/SearchPage.jsx
import React, { useState } from "react";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const dummy = {
    poster: "https://via.placeholder.com/200x300",
    title: "영화제목",
  };

  return (
    <div className="container">
      <div className="search-box">
        <input
          type="text"
          placeholder="영화 이름을 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {keyword && (
        <div className="movie-info" style={{ marginTop: "1rem" }}>
          <img src={dummy.poster} alt={dummy.title} />
          <div className="movie-detail">
            <h2>{dummy.title}</h2>
          </div>
        </div>
      )}
    </div>
  );
}
