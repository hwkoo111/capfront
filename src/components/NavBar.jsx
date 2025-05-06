// src/components/NavBar.jsx
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/">게시판</Link>
      <Link to="/playlist">플레이리스트</Link>
      <Link to="/friend-find">친구찾기</Link>
      <Link to="/login">로그인</Link>
      <Link to="/signup">회원가입</Link>
    </nav>
  );
}
