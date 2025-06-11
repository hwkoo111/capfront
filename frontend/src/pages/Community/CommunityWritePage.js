import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/CommunityPage.css";

const CommunityWritePage = () => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [error, setError] = useState("");
  const [categoryId, setCategoryId] = useState(1); // 카테고리 ID 초기값
  const navigate = useNavigate();

  // 카테고리 변경 핸들러
  const handleCategoryChange = (e) => {
    setCategoryId(Number(e.target.value)); // 선택한 카테고리 ID 업데이트
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("제목을 입력하세요.");
    if (!contents.trim()) return setError("내용을 입력하세요.");
    setError("");

    try {
      const res = await fetch("/api/community/enter/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          content: contents,
          categoryId, // 동적으로 카테고리 ID 설정
        }),
      });

      if (!res.ok) throw new Error("등록에 실패했습니다.");
      
      alert("게시글이 정상 등록되었습니다.");
      
      // 등록 성공 시 커뮤니티 목록으로 이동
      navigate("/community");
    } catch (error) {
      console.error(error); // 에러 발생 시 콘솔에 로그 출력
      setError("글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="community-posts">
      <div className="heading">Community</div>
      <div className="sub-heading">게시판 등록</div>
      
      <form className="write-form" onSubmit={handleSubmit}>
        {/* 카테고리 선택 */}
        <div className="category-select">
          <label htmlFor="category">카테고리:</label>
          <select
            id="category"
            value={categoryId}
            onChange={handleCategoryChange}
            className="category-select-input"
          >
            <option value={1}>자유 게시판</option>
            <option value={2}>영화 리뷰 게시판</option>
            <option value={3}>영화 질문/추천 게시판</option>
          </select>
        </div>

        {/* 제목 입력 */}
        <div className="write-title-row">
          <label htmlFor="title" className="write-label">
            <b>제목:</b>
          </label>
          <input
            id="title"
            className="write-title-input"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 입력 */}
        <textarea
          className="write-contents"
          placeholder="글 내용을 입력하세요"
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          rows={9}
        />

        {error && <div className="error-message">{error}</div>}

        <div style={{ textAlign: "right" }}>
          <button type="submit" className="write-btn">
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunityWritePage;
