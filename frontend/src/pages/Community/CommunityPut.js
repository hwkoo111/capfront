import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";

const CommunityPut = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { nickname } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [error, setError] = useState('');

  // 1. 기존 게시글 정보 조회
  useEffect(() => {
    (async () => {
     try {
      const res = await fetch(`/api/community/posts/${postId}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('게시글을 불러오는 데 실패했습니다.');
      }
        const data = await res.json();
        // 권한 체크(본인만 수정 가능 등) 추가 가능
        setTitle(data.title || '');
        setContents(data.contents || '');
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [postId]);

  // 2. 수정 API 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !contents.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }
    try {
      const res = await fetch(`/api/community/enter/put/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content:contents }),
      });
      if (!res.ok) throw new Error("수정에 실패했습니다.");
      alert("수정 완료");
      navigate(`/community/post/${postId}`); // 상세페이지로 이동
    } catch (e) {
      setError(e.message);
    }
  };

  if (error) return <div style={{ color: 'red', margin: 20 }}>{error}</div>;

  return (
    <div className="write-form" style={{ maxWidth: 600, margin: "48px auto" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 16 }}>게시글 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="write-title-row">
          <label className="write-label">제목</label>
          <input
            className="write-title-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>
        <div>
          <textarea
            className="write-contents"
            value={contents}
            onChange={e => setContents(e.target.value)}
            maxLength={2000}
            rows={10}
            placeholder="내용을 입력하세요"
          />
        </div>
        <button className="write-btn" type="submit">수정 완료</button>
      </form>
    </div>
  );
};

export default CommunityPut;
