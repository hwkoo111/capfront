// src/pages/Mypage/MyPage.js

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import axios from "axios";
import "../../styles/MyPage.css";
import logo from "../../assets/logo.png";
import { FiEdit2, FiSearch  } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineConsoleSql } from "react-icons/ai";

const MyPage = () => {
  const { nickname, setNickname } = useContext(AuthContext);
  const [newNickname, setNewNickname] = useState(nickname || "");
  const [nicknameMsg, setNicknameMsg] = useState("");
  const [movies, setMovies] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  // 닉네임 입력 연동
  useEffect(() => {
    setNewNickname(nickname || "");
    if (nickname) {
    fetchFavoriteMovies(nickname);
  }
    fetchUserPlaylist();
  }, [nickname]);

  // 닉네임 수정
  const handleUpdateNickname = async (e) => {
    e.preventDefault();
    const trimmed = newNickname.trim();
    if (!trimmed) {
      setNicknameMsg("새 닉네임을 입력하세요.");
      return;
    }
    if (trimmed === nickname) {
      setNicknameMsg("현재 닉네임과 동일합니다.");
      return;
    }
    try {
      await axios.post(
        "/api/user/set-nickname",
        { nickname: trimmed },
        { withCredentials: true }
      );
      setNickname(trimmed);
      setNicknameMsg("닉네임이 변경되었습니다.");
      fetchUserPlaylist();
      fetchFavoriteMovies(trimmed);
    } catch (err) {
      setNicknameMsg("닉네임 변경 중 오류가 발생했습니다.");
    }
  };

  async function fetchFavoriteMovies(targetNickname) {
    try {
      const res = await axios.get("/api/friend", {
        params: { nickname: targetNickname },
        withCredentials: true,
      });
      setMovies(res.data.moviePlaylistSummaryDtos || []);
    } catch (err) {
      console.error("영화 조회 오류:", err);
      setError("즐겨찾기 영화 조회 실패");
      setMovies([]);
    }
  }

  const fetchUserPlaylist = async () => {
  try {
    const res = await axios.get("/api/playlist/myplaylist", {
      withCredentials: true,
    });

    const sorted = (res.data || []).sort((a, b) => {
      return new Date(b.playListDate) - new Date(a.playListDate);  // 내림차순 정렬
    });

    setPlaylist(sorted);
  } catch (err) {
    console.error("플레이리스트 조회 오류:", err);
    setError("플레이리스트 조회 실패");
    setPlaylist([]);
  }
}



  //playlist 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/playlist/enter/delete/${id}`, { withCredentials: true });
      setPlaylists(playlists.filter(p => p.playListId !== id));
    } catch (err) {
      alert('삭제 실패');
    }
  }
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  }

  return (
    <div className="my-page-root">
      <div className="my-page-title">MY PAGE</div>

      {/* 닉네임 */}
      <div className="my-page-nickname-row">
        <span className="my-page-nickname-label">닉네임</span>
        <form className="my-page-nickname-form" onSubmit={handleUpdateNickname}>
          <input
            className="my-page-nickname-input"
            type="text"
            value={newNickname}
            onChange={e => setNewNickname(e.target.value)}
            placeholder="새 닉네임을 입력하세요"
            autoComplete="off"
          />
          <button className="my-page-nickname-btn" type="submit">
            <FiEdit2 />
          </button>
        </form>
        {nicknameMsg && <div className="my-page-msg">{nicknameMsg}</div>}
      </div>

      {/* Custom Film */}
      <div className="my-page-section-title-container">
        <div className="my-page-section-title">즐겨찾기</div>
        <button className="my-page-movie-edit-btn" type="button" onClick={() => navigate(`/mypage/edit`)}>
          <FiEdit2 />
        </button>
      </div>
      <div className="my-page-movie-row">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div className="my-page-movie-card" key={movie.title} onClick = {() => handleMovieClick(movie.movieId)}>
              <div className="my-page-movie-toolbar"/>
              <img
                src={movie.posterUrl || logo}
                alt={movie.title}
                className="my-page-movie-img"
              />
              <div className="my-page-movie-title">{movie.title || "MovieName"}</div>
            </div>
          ))
        ) : (
          <div className="my-page-movie-empty">즐겨찾기 영화가 없습니다.</div>
        )}
      </div>

      {/* Playlist */}
      <div className="my-page-section-title" style={{ marginTop: 32 }}>Playlist</div>
      <ul className="my-page-playlist-list">
      {playlist.length > 0 ? (
        playlist.map((item) => (
          <li key={item.playListId} className="my-page-playlist-card">
            <div className="my-page-playlist-row">
              <Link to={`/playlist/view/${item.playListId}`} className="my-page-playlist-title">
                {item.playListName || "플레이리스트명"}
              </Link>
        
              <div className="my-page-playlist-date">
                {item.playListDate ? item.playListDate.slice(0, 10).replace(/-/g, ".") : "2025.05.15"}
              </div>

              <div className="my-page-playlist-author">
                {item.memberNickname}
              </div>

              <div className="my-page-playlist-actions">
                <button onClick={() => navigate(`/playlist/put/${item.playListId}`)}>수정</button>
                <button onClick={() => handleDelete(item.playListId)}>삭제</button>
              </div>
            </div>
          </li>
        ))
      ) : (
        <li className="my-page-playlist-empty">등록된 플레이리스트가 없습니다.</li>
      )}
        </ul>

      {error && <div className="my-page-msg">{error}</div>}
    </div>
  );
};

export default MyPage;
