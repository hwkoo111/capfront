// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import Search from "./pages/Search";
import MovieInfo from "./pages/MovieInfo";
import Playlist from "./pages/PlayList";
import PlaylistDetail from "./pages/PlaylistDetail";
import FriendFind from "./pages/FriendFind";
import MyPage from "./pages/MyPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        {/* 헤더 */}
        <Header />

        {/* 내비게이션 */}
        <NavBar />

        {/* 메인 콘텐츠: URL에 따라 페이지 전환 */}
        <main className="container">
          <Routes>

          {/* {검색창} */}
          <Route path="/" element={<Home />} />  

            {/* 게시판 (메인) */}
            <Route path="/" element={<Home />} />

            {/* 검색 페이지 */}
            <Route path="/search" element={<Search />} />

            {/* 영화 상세 */}
            <Route path="/movie/:id" element={<MovieInfo />} />

            {/* 플레이리스트 목록 & 작성 */}
            <Route path="/playlist" element={<Playlist />} />
            {/* 플레이리스트 상세 (/:playlistId) */}
            <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />

            {/* 친구 찾기 */}
            <Route path="/friend-find" element={<FriendFind />} />

            {/* 마이페이지 */}
            <Route path="/mypage" element={<MyPage />} />

            {/* 로그인 & 회원가입 */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 기타 잘못된 경로 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* 푸터 */}
        <footer className="footer">영화의 모든것 © MovieTalk</footer>
      </div>
    </Router>
  );
}
