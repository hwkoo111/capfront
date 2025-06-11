import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/FindFriendPage.css';
import logo from "../../assets/logo.png";
import { FiSearch } from "react-icons/fi";

const FindFriendPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [nickname, setNickname] = useState('');

  const [movies, setMovies] = useState([]);
  const [comment, setComment] = useState('');
  const [hasComment, setHasComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 닉네임이 설정되었을 때만 API 호출
  useEffect(() => {
    const fetchFriendData = async () => {
      if (!nickname || nickname.trim() === '') return;

      setIsLoading(true);
      setError('');
      try {
        const resMovie = await axios.get('/api/friend', { params: { nickname } });
        setMovies(resMovie.data.moviePlaylistSummaryDtos || []);
      } catch (err) {
        setMovies([]);
        setComment('');
        setHasComment(false);
        setError('해당 회원을 찾을 수 없습니다.');
      }
      setIsLoading(false);
    };

    fetchFriendData();
  }, [nickname]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      setNickname(trimmed);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  }

  return (
    <div className="find-friend-container">
      <div className="find-friend-title">Find Friend</div>
      <div className="find-friend-searchbar-row">
        <form className="find-friend-searchbar" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="검색할 닉네임을 입력하세요"
            disabled={isLoading}
          />
          <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <FiSearch className="search-icon" />
          </button>
        </form>
      </div>

      <div className="find-friend-custom-title">
        {nickname ? `${nickname} 님의 추천 영화 TOP3` : ""}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="find-friend-movie-list">
        {movies.length > 0 ? (
          movies.map((movie, idx) => (
            <div className="find-friend-movie-card" key={idx}>
              <img
                src={movie.posterUrl || logo}
                alt={movie.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "7px 7px 0 0" }}
              />
              <div className="find-friend-movie-title">{movie.title || "MovieName"}</div>
              <button className="find-friend-detail-btn" onClick={() => handleMovieClick(movie.movieId)}>상세보기</button>
            </div>
          ))
        ) : (
          <div className="no-movies"></div>
        )}
      </div>
    </div>
  );
};

export default FindFriendPage;
