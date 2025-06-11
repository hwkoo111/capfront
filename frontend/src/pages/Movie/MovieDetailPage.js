import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import "../../styles/MovieDetail.css";
import logo from "../../assets/logo.png";
import star from "../../assets/star.png";

const MovieDetailPage = () => {
  const { isLoggedIn, nickname } = useContext(AuthContext);
  const { movieId } = useParams();

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [reviewRating, setReviewRating] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewList, setReviewList] = useState([]);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingRating, setEditingRating] = useState("");
  const [editingComment, setEditingComment] = useState("");

  // 리뷰 목록 새로고침 함수
  const fetchReviews = useCallback(() => {
    fetch(`/api/reviews/movie/${movieId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setReviewList(data))
      .catch(() => setReviewList([]));
  }, [movieId]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/movie/search/${movieId}`)
      .then((res) => {
        if (!res.ok) throw new Error("영화 정보를 불러올 수 없습니다.");
        return res.json();
      })
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    fetchReviews();
  }, [movieId, fetchReviews]);

  // 내 리뷰 추출(리스트에 내 닉네임인 리뷰)
  const myReview = reviewList.find((r) => r.nickname === nickname);

  // 리뷰 등록
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    if (!reviewRating) {
      setReviewError("별점을 선택하세요.");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("코멘트를 입력하세요.");
      return;
    }
    if (myReview) {
      setReviewError("이미 리뷰를 작성하셨습니다.");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          movieId: Number(movieId), // 타입 주의
          rating: Number(reviewRating),
          comment: reviewComment,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setReviewError(msg || "리뷰 등록 실패");
        return;
      }
      setReviewRating("");
      setReviewComment("");
      fetchReviews();
    } catch {
      setReviewError("리뷰 등록 실패");
    }
  };

  // 수정 모드 진입 (본인 리뷰만)

  const handleEdit = (review) => {
    if (review.nickname !== nickname) return; // 내 리뷰 아니면 무시
    setEditingReviewId(review.reviewId);
    setEditingRating(String(review.rating));
    setEditingComment(review.comment);
    setReviewError("");
  };

  // 수정 저장
  const handleEditSave = async (reviewId) => {
    if (!editingRating) {
      setReviewError("별점을 선택하세요.");
      return;
    }
    if (!editingComment.trim()) {
      setReviewError("코멘트를 입력하세요.");
      return;
    }
    const bodyData = {
      movieId: Number(movieId),
      rating: Number(editingRating),
      comment: editingComment,
    };

    console.log("수정 요청 바디 데이터:", bodyData); // 여기서 확인 가능

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });
      if (!res.ok) {
        const msg = await res.text();
        setReviewError(msg || "리뷰 수정 실패");
        return;
      }
      setEditingReviewId(null);
      setEditingRating("");
      setEditingComment("");
      setReviewError("");
      fetchReviews();
    } catch {
      setReviewError("리뷰 수정 실패");
    }
  };

  const handleEditCancel = () => {
    setEditingReviewId(null);
    setEditingRating("");
    setEditingComment("");
    setReviewError("");
  };

  // 삭제 (본인 리뷰만)
  const handleDelete = async (reviewId, reviewNickname) => {
    if (reviewNickname !== nickname) return; // 내 리뷰만
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const msg = await res.text();
        setReviewError(msg || "리뷰 삭제 실패");
        return;
      }
      if (editingReviewId === reviewId) handleEditCancel();
      fetchReviews();
    } catch {
      setReviewError("리뷰 삭제 실패");
    }
  };

  // 평균 평점
  const avgScore =
    reviewList.length > 0
      ? (
          reviewList.reduce((a, c) => a + (c.rating || 0), 0) /
          reviewList.length
        ).toFixed(1)
      : "0";

  if (loading) return <div className="movie-detail-root">로딩 중...</div>;
  if (error) return <div className="movie-detail-root">{error}</div>;
  if (!movie)
    return <div className="movie-detail-root">영화 정보가 없습니다.</div>;

  return (
    <div className="movie-detail-root">
      <h1 className="movie-detail-title">{movie.title}</h1>
      <div className="movie-detail-main">
        <div className="movie-detail-posterbox">
          <div className="movie-detail-poster">
            <img src={movie.posterUrl || logo} alt={movie.title} />
          </div>
          <div className="movie-detail-poster-title">
            {movie.title || "title"}
          </div>
        </div>
        <div className="movie-detail-infolist">
          <div className="movie-detail-infoline">
            <span className="movie-detail-info-label">개봉일</span>
            <span className="movie-detail-info-value">
              {movie.releaseDts || "-"}
            </span>
          </div>
          <div className="movie-detail-infoline">
            <span className="movie-detail-info-label">등급</span>
            <span className="movie-detail-info-value">
              {movie.rating || "-"}
            </span>
          </div>
          <div className="movie-detail-infoline">
            <span className="movie-detail-info-label">장르</span>
            <span className="movie-detail-info-value">
              {movie.genre || "-"}
            </span>
          </div>
          <div className="movie-detail-infoline">
            <span className="movie-detail-info-label">감독</span>
            <span className="movie-detail-info-value">
              {movie.director || "-"}
            </span>
          </div>
          <div className="movie-detail-infoline">
            <span className="movie-detail-info-label">출연</span>
            <span className="movie-detail-info-value">
              {movie.actor || "-"}
            </span>
          </div>
        </div>
      </div>
      <div className="movie-detail-section">
        <h2 className="movie-detail-section-title">줄거리</h2>
        <div className="movie-detail-section-body">{movie.plot || "-"}</div>
      </div>
      {/* 평점, 한줄평 영역 */}
      <div className="movie-detail-reviewarea">
        <div className="movie-detail-review-label">평점 / 한줄평</div>
        <div className="movie-detail-review-starbox">
          <img src={star} alt="star" />
          <div className="movie-detail-review-score">{avgScore}점</div>
          <div className="movie-detail-review-count">
            {reviewList.length}건 참여
          </div>
        </div>
        {isLoggedIn && (
          <form
            className="movie-detail-review-form"
            onSubmit={handleReviewSubmit}
          >
            <select
              className="movie-detail-review-select"
              value={reviewRating}
              onChange={(e) => setReviewRating(e.target.value)}
              disabled={!!myReview}
            >
              <option value="">별점</option>
              <option value="1">1점</option>
              <option value="2">2점</option>
              <option value="3">3점</option>
              <option value="4">4점</option>
              <option value="5">5점</option>
            </select>
            <input
              className="movie-detail-review-input"
              placeholder="한줄평을 입력하세요 (최대 120자)"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              maxLength={120}
              disabled={!!myReview}
            />
            <button
              type="submit"
              className="movie-detail-review-btn"
              disabled={!!myReview}
            >
              등록
            </button>
          </form>
        )}
        {myReview && (
          <div
            style={{ color: "#999", margin: "6px 0 0 0", fontSize: "0.98em" }}
          >
            이미 등록한 리뷰가 있습니다. (수정/삭제만 가능)
          </div>
        )}
        {reviewError && (
          <div className="movie-detail-review-error">{reviewError}</div>
        )}
        <div className="movie-detail-review-list">
          {reviewList.length === 0 && (
            <div
              className="movie-detail-review-item"
              style={{ color: "#aaa", textAlign: "center" }}
            >
              등록된 리뷰가 없습니다.
            </div>
          )}
          {reviewList.map((item) => (
            <div className="movie-detail-review-item" key={item.reviewId}>
              {editingReviewId === item.reviewId &&
              nickname === item.nickname ? (
                <>
                  <select
                    className="movie-detail-review-item"
                    value={editingRating}
                    onChange={(e) => setEditingRating(e.target.value)}
                    style={{ marginRight: 8 }}
                  >
                    <option value="5">5점</option>
                    <option value="4">4점</option>
                    <option value="3">3점</option>
                    <option value="2">2점</option>
                    <option value="1">1점</option>
                  </select>
                  <input
                    className="movie-detail-review-input"
                    placeholder="수정할 내용을 입력하세요 (최대 120자)"
                    value={editingComment}
                    onChange={(e) => setEditingComment(e.target.value)}
                    maxLength={120}
                    style={{ width: 200, marginRight: 8 }}
                  />
                  <button
                    type="button"
                    className="movie-detail-review-btn"
                    onClick={() => handleEditSave(item.reviewId)}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className="movie-detail-review-btn"
                    onClick={handleEditCancel}
                    style={{ marginLeft: 5 }}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <span className="movie-detail-review-item-score">
                    ⭐ {item.rating}점
                  </span>
                  <span style={{ color: "#888", fontSize: "0.9em" }}>
                    {item.nickname}
                  </span>
                  <span className="movie-detail-review-item-comment">
                    {item.comment}
                  </span>
                  {/* 본인 리뷰만 버튼 노출 */}
                  {isLoggedIn && nickname === item.nickname && (
                    <span style={{ marginLeft: 10 }}>
                      <button
                        onClick={() => handleEdit(item)}
                        className="movie-detail-review-btn"
                        style={{ marginRight: 10 }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(item.reviewId, item.nickname)
                        }
                        className="movie-detail-review-btn"
                      >
                        삭제
                      </button>
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
