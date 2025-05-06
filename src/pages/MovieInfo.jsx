// src/components/MovieInfoPage.jsx
import React, { useState } from "react";

export default function MovieInfoPage() {
  const dummyDetail = {
    poster: "https://via.placeholder.com/200x300",
    title: "영화제목",
    tagline: "줄거리 요약 텍스트가 여기에 들어갑니다.",
    info: {
      장르: "호러",
      상영시간: "120분",
      관람등급: "15세 관람가",
      개봉일자: "2025-05-01",
    },
    cast: ["최유식", "장종연", "박정민", "김다미", "박보검"],
    rating: { score: 8.7, count: 49273 },
  };
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  const submitReview = () => {
    if (!review) return;
    setReviews((prev) => [...prev, review]);
    setReview("");
  };

  return (
    <div className="container">
      <div className="movie-info">
        <img src={dummyDetail.poster} alt={dummyDetail.title} />
        <div className="movie-detail">
          <h2>{dummyDetail.title}</h2>
          <p>
            <em>{dummyDetail.tagline}</em>
          </p>
          <p>
            {Object.entries(dummyDetail.info)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | ")}
          </p>
          <p>출연: {dummyDetail.cast.join(", ")}</p>
          <p>
            별점: ★ {dummyDetail.rating.score} ({dummyDetail.rating.count}명
            참여)
          </p>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <input
          className="input-review"
          type="text"
          placeholder="한줄평을 입력하세요"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button className="button" onClick={submitReview}>
          등록
        </button>
      </div>

      <ul className="review-list">
        {reviews.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
