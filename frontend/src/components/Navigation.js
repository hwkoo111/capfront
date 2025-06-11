import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../styles/Navigation.css";
import profile from "../assets/mainpage/user.png";

const Navigation = () => {
  const { isLoggedIn, setIsLoggedIn, nickname, setNickname } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm("정말 로그아웃하시겠습니까?")) return;
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("로그아웃 요청 실패", e);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
     // 챗봇 관련 데이터 삭제
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("chatInput");

    setIsLoggedIn(false);
    setNickname("");
    alert("로그아웃되었습니다.");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      {/* 중앙 메뉴 */}
      <div className="navbar-menu">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Community
        </NavLink>
        <NavLink
          to="/playlist"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Playlist
        </NavLink>
        <NavLink
          to="/findfriend"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          FindFriend
        </NavLink>
      </div>
      {/* 우측 인증/유저 */}
      <div className="navbar-auth">
        {isLoggedIn ? (
          <>
            <span className="navbar-welcome">{nickname}님 환영합니다!</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
            <NavLink to="/mypage">
              <span className="user">
                <img src={profile} alt="Profile" />
              </span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login" className="auth-link">
              로그인
            </NavLink>
            <NavLink to="/signup" className="auth-link">
              회원가입
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
