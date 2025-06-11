import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext"; // AuthContext 가져오기
import "../../styles/CommunityPage.css";

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0); // zero-based
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [effectiveSearchTerm, setEffectiveSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [categoryId, setCategoryId] = useState(1);

  const navigate = useNavigate();
  const { isLoggedIn, nickname } = useContext(AuthContext); // 사용자 닉네임도 함께 가져오기

  // 🔍 검색 실행
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;
    setEffectiveSearchTerm(trimmedTerm);
    setPage(0);
  };

  // 📥 게시글 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let url = `/api/community/posts/category/${categoryId}?page=${page}`;
        if (effectiveSearchTerm) {
          url = `/api/community/posts/search?keyword=${encodeURIComponent(effectiveSearchTerm)}&categoryId=${categoryId}&page=${page}`;
        }

        const res = await fetch(url, { credentials: "include" });

        if (res.status === 204) {
          setPosts([]);
          setErrorMessage('게시글이 없습니다.');
          setTotalPages(1);
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error("게시글을 불러오는 데 실패했습니다.");

        const data = await res.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 1);
        setErrorMessage('');
      } catch (e) {
        setPosts([]);
        setErrorMessage(e.message);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [page, categoryId, effectiveSearchTerm]);

  // ✍ 글쓰기 이동
  const handleWrite = () => {
    if (!isLoggedIn) {
      alert("로그인 후 글을 작성할 수 있습니다.");
      navigate("/login");
      return;
    }
    navigate('/community/write');
  };

  // 🗂 카테고리 변경
  const handleCategoryChange = (e) => {
    setCategoryId(Number(e.target.value));
    setPage(0);
    setEffectiveSearchTerm('');
    setSearchTerm('');
    setErrorMessage('');
  };

  // 상세 페이지 이동
  const handlePostClick = (postId) => {
    navigate(`/community/post/${postId}`);
  };

  // 수정 버튼
  const handleEdit = (e, postId) => {
    e.stopPropagation();
    navigate(`/community/put/${postId}`);
  };

  // 삭제 버튼 delete api를 모르겠음음
  const handleDelete = async (e, postId) => {
    e.stopPropagation();
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/community/enter/delete/${postId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error("삭제 실패");
      setPosts(posts.filter((p) => p.postId !== postId));
    } catch {
      alert('삭제 실패');
    }
  };

  return (
    <div className="community-posts">
      <div className="heading">Community</div>
      <div className="sub-heading"></div>

      {/* 🔍 검색 & 작성 버튼 */}
      <form className="search-row" onSubmit={handleSearch}>
        <select className="search-type" disabled>
          <option value="title">제목+내용</option>
        </select>
        <input
          className="search-input"
          placeholder="검색할 것을 입력하세요"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-btn">🔍</button>
        <button type="button" className="write-btn" onClick={handleWrite}>작성</button>
      </form>

      {/* 🗂 카테고리 선택 */}
      <div className="category-select">
        <label htmlFor="category">카테고리: </label>
        <select id="category" value={categoryId} onChange={handleCategoryChange}>
          <option value={1}>자유게시판</option>
          <option value={2}>영화리뷰게시판</option>
          <option value={3}>영화질문/추천게시판</option>
        </select>
      </div>

      {/* 📋 게시글 헤더 */}
      <div className="post-header-row">
        <span className="post-title">제목</span>
        <span className="post-date">게시일</span>
        <span className="post-nickname">작성자</span>
      </div>

      {/* ⚠ 에러 메시지 */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* ⏳ 로딩 또는 게시글 목록 */}
      {loading ? (
        <div className="loading-message">로딩 중...</div>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li
              key={post.postId}
              className="post-item"
              onClick={() => handlePostClick(post.postId)}
            >
              <span className="post-title">{post.title}</span>
              <span className="post-date">{(post.createdAt || '').slice(0, 10)}</span>
              <span className="post-nickname">{post.nickname}</span>
              <span className="post-action">
                {/* 본인 글에만 수정/삭제 허용. 모든 글에 허용하려면 조건 삭제 */}
                {nickname === post.nickname && (
                  <>
                    <button
                      className="edit-btn"
                      onClick={e => handleEdit(e, post.postId)}
                    >수정</button>
                    <button
                      className="delete-btn"
                      onClick={e => handleDelete(e, post.postId)}
                    >삭제</button>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* 📄 페이지네이션 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`pagination-btn${i === page ? ' selected' : ''}`}
            onClick={() => setPage(i)}
            disabled={i === page}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
