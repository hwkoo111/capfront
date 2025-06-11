import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "../../styles/CommunityDetail.css";
import { AuthContext } from "../../auth/AuthContext";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [postDetail, setPostDetail] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { nickname } = useContext(AuthContext);

  const fetchPostDetail = async () => {
    try {
      const res = await fetch(`/api/community/posts/${postId}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("게시글을 불러오는 데 실패했습니다.");
      }
      const data = await res.json();
      setPostDetail(data);
      setIsLoading(false);
    } catch (error) {
      console.error("게시글 상세 정보를 불러오는 데 실패했습니다.", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const token = getCookie("Authorization"); // 쿠키에서 JWT 토큰 읽기

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      console.log("JWT Token from Cookie: ", token); // 읽어온 토큰 콘솔에 출력

      const response = await fetch(`/api/community/enter/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 토큰 포함
        },
        body: JSON.stringify({ content: newComment }),
        credentials: "include", // 쿠키 포함 요청
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "댓글 등록에 실패했습니다.");
        } catch (e) {
          throw new Error(errorText || "댓글 등록에 실패했습니다.");
        }
      }

      setNewComment("");
      fetchPostDetail(); // 댓글 등록 후 게시글 상세 정보 새로 고침
    } catch (error) {
      console.error("댓글 등록 중 오류가 발생했습니다:", error);
      alert(error.message || "댓글 등록에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/community/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "댓글 삭제에 실패했습니다.");
      }
      alert("댓글이 정상적으로 삭제되었습니다.");
      fetchPostDetail(); // 삭제 후 댓글 새로고침
    } catch (err) {
      alert(err.message || "댓글 삭제에 실패했습니다.");
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop().split(";").shift();
      console.log(`Cookie Value for ${name}: ${cookieValue}`); // 쿠키 값 콘솔 출력
      return cookieValue;
    }
    return null;
  };

  if (isLoading) {
    return <div className="post-detail">게시글을 불러오는 중입니다...</div>;
  }

  return (
    <div className="post-detail">
      {postDetail && (
        <>
          {/* 제목 + 작성자/작성일 한 줄에 배치 */}
          <div className="title-row">
            <h1 className="post-title">{postDetail.title}</h1>
            <div className="post-meta">
              <span>
                {postDetail.nickname} |{" "}
                {new Date(postDetail.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p>{postDetail.content}</p>

          <div className="comments">
            <h3>댓글</h3>
            <form
              onSubmit={handleCommentSubmit}
              style={{ marginBottom: "2rem" }}
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  resize: "vertical",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#888",
                  color: "white",
                  border: "none",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                댓글 작성
              </button>
            </form>

            {postDetail.comments.map((comment) => (
              <div key={comment.commentId} className="comment-item">
                <div className="comment-author">
                  <span role="img" aria-label="user-icon">
                    👤
                  </span>
                  {comment.nickname}
                </div>
                <p>{comment.content}</p>
                <div className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
                {/* ✅ 본인 댓글일 경우에만 삭제 버튼 표시 */}
                {nickname === comment.nickname && (
                  <button
                    onClick={() => handleDeleteComment(comment.commentId)}
                    style={{
                      background: "#888",
                      color: "#faf3f3",
                      fontWeight: 500,
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.93rem 2.1rem",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                      textDecoration: "none",
                      transition:
                        "background 0.18s, box-shadow 0.2s, transform 0.16s",
                      boxShadow: "0 3px 18px rgba(74,144,226,0.12)",
                      marginTop: "0.5rem",
                    }}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="back-to-list">
            <a href="/community">목록으로 돌아가기</a>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetailPage;
