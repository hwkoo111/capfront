import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/PlaylistEnter.css";

const PlaylistEnter = () => {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // 선택 영화 ID 배열 대신, 선택 영화 전체 객체 배열로 관리
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 1. 로그인 상태 확인 및 선택 영화 초기화
  useEffect(() => {
    const fetchCurrentUserAndSelection = async () => {
      try {
        const authRes = await axios.get("/api/auth/status", {
          withCredentials: true,
        });
        if (!authRes.data.isLoggedIn) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        // 선택된 영화 ID 목록 받아오기
        const selectionRes = await axios.get(
          "/api/playlist/enter/search/selection",
          { withCredentials: true }
        );

        const selectedIds = selectionRes.data; // [1, 2, 3 ...]

        // 선택된 영화 상세 정보 API는 없으므로, 검색 API에서 상세 정보 가져오기
        // 선택된 영화들의 상세 정보를 가져오는 임시 로직: 전체 검색 결과 중 선택된 영화만 필터링
        // 여기서는 검색 결과가 없으면 빈 배열 상태

        setSelectedMovies([]); // 초기화
        setIsLoading(false);
      } catch (e) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    };

    fetchCurrentUserAndSelection();
  }, [navigate]);

  // 2. 영화 검색
  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }
    try {
      const res = await axios.get(`/api/playlist/enter/search?keyword=${keyword}`);
      setSearchResults(res.data);
    } catch (e) {
      alert("검색 실패");
    }
  };

  // 3. 영화 추가
  const handleAddMovie = async (movie) => {
    if (selectedMovies.some((m) => m.movieId === movie.movieId)) {
      alert("이미 선택한 영화입니다.");
      return;
    }

    try {
      await axios.post(
        `/api/playlist/enter/search/add?movieId=${movie.movieId}`,
        {},
        { withCredentials: true }
      );
      setSelectedMovies((prev) => [...prev, movie]);
    } catch (e) {
      alert("추가 실패");
    }
  };

  // 4. 영화 선택 취소
  const handleRemoveMovie = async (movieId) => {
    // 삭제 API가 없으면 프론트 상태에서만 제거
    setSelectedMovies((prev) => prev.filter((m) => m.movieId !== movieId));
    // 필요시 백엔드 삭제 API 호출 추가 가능
  };

  // 5. 플레이리스트 생성
  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      alert("플레이리스트 이름을 입력하세요.");
      return;
    }
    if (selectedMovies.length === 0) {
      alert("선택된 영화가 없습니다.");
      return;
    }
    try {
      await axios.post(
        `/api/playlist/enter/create?name=${playlistName}`,
        {},
        { withCredentials: true }
      );
      alert("플레이리스트 생성 완료");
      // 생성 후 초기화
      setPlaylistName("");
      setSelectedMovies([]);
      setSearchResults([]);
      setKeyword("");
      navigate("/playlist");
    } catch (e) {
      alert("생성 실패");
    }
  };

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <div className="playlist-enter-container">
      <h2>플레이리스트 만들기</h2>

      <section className="search-section">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="영화 제목 검색"
          className="search-input"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} className="search-btn">
          검색
        </button>
      </section>

      <section className="search-results">
        <h3>검색 결과</h3>
        {searchResults.length === 0 && <p>검색 결과가 없습니다.</p>}
        <ul>
          {searchResults.map((movie) => (
            <li key={movie.movieId} className="movie-item">
              <strong>{movie.title}</strong> ({movie.createDts}) - {movie.genre}
              {/* <p className="movie-plot">{movie.plot}</p> */}
              <button onClick={() => handleAddMovie(movie)} className="add-btn">
                선택
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="selected-movies">
        <h3>선택된 영화 ({selectedMovies.length})</h3>
        {selectedMovies.length === 0 && <p>영화를 선택해 주세요.</p>}
        <ul>
          {selectedMovies.map((movie) => (
            <li key={movie.movieId} className="selected-movie-item">
              {movie.title}
              <button
                onClick={() => handleRemoveMovie(movie.movieId)}
                className="remove-btn"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="playlist-create">
        <input
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="플레이리스트 이름"
          className="playlist-name-input"
        />
        <button onClick={handleCreatePlaylist} className="create-btn">
          플레이리스트 생성
        </button>
      </section>
    </div>
  );
};

export default PlaylistEnter;
