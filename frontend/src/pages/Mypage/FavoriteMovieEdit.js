import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../../styles/PlaylistEnter.css";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { MdOutlineVoiceChat } from "react-icons/md";

const FavoriteMovieEdit = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovieIds, setSelectedMovieIds] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]); // 영화 상세 정보 리스트
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { nickname, isLoggedIn } = useContext(AuthContext);
  const [memberId, setMemberId] = useState(null);
  const navigate = useNavigate();

  // 처음 접속 시 서버에 저장된 선택 목록 불러오기
  useEffect(() => {
    const fetchSelectedMovies = async () => {
      try {
        const authRes = await axios.get("/api/auth/status", {
          withCredentials: true,
        });

        if (!authRes.data.isLoggedIn) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        const memberId = await axios.get(`/api/mypage/find/memberId`, {
          params: { nickname },
          withCredentials: true,
        });

        setMemberId(memberId.data);

        const res = await axios.get(`/api/mypage/enter/${nickname}/favorites`, {
          withCredentials: true,
        });

        const favoriteMovies = res.data;

        setSelectedMovies(favoriteMovies);
        setSelectedMovieIds(favoriteMovies.map((m) => m.movieId));

        // localStorage 저장
        localStorage.setItem(
          `favorite_movies_${nickname}`,
          JSON.stringify(favoriteMovies.map((m) => m.movieId))
        );

        // 상태 반영
      } catch {
        alert("선택된 영화 목록을 불러오는 데 실패했습니다.");
        localStorage.removeItem(`favorite_movies_${nickname}`); // 실패 시 로컬도 정리
      }
    };

    if (nickname) {
      fetchSelectedMovies();
    }
  }, [nickname, navigate]);

  // 영화 검색
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }
    try {
      const res = await axios.get(
        `/api/mypage/enter/search?keyword=${searchKeyword}`
      );
      setSearchResults(res.data);
    } catch {
      alert("영화 검색에 실패했습니다.");
    }
  };

  //영화 삭제
  const handleRemoveMovie = (movieId) => {
    const updatedIds = selectedMovieIds.filter((id) => id !== movieId);
    const updatedMovies = selectedMovies.filter((m) => m.movieId !== movieId);

    setSelectedMovieIds(updatedIds);
    setSelectedMovies(updatedMovies);

    localStorage.setItem(
      `favorite_movies_${nickname}`,
      JSON.stringify(updatedIds)
    );
  };

  const handleAddMovie = (movieId) => {
    if (selectedMovieIds.includes(movieId)) {
      alert("이미 선택한 영화입니다.");
      return;
    }

    if (selectedMovies.length >= 3) {
      alert("최애 영화는 3개까지만 선택 가능합니다.");
      return;
    }

    const movie = searchResults.find((m) => m.movieId === movieId);
    if (!movie) {
      alert("해당 영화를 찾을 수 없습니다.");
      return;
    }

    const updatedIds = [...selectedMovieIds, movie.movieId];
    const updatedMovies = [...selectedMovies, movie];

    setSelectedMovieIds(updatedIds);
    setSelectedMovies(updatedMovies);

    localStorage.setItem(
      `favorite_movies_${nickname}`,
      JSON.stringify(updatedIds)
    );
  };

  // 최애영화 등록
  const handleSubmit = async () => {
    if (!memberId) {
      alert("회원 정보를 불러오지 못했습니다. 페이지를 새로고침 해보세요.");
      return;
    }

    if (selectedMovieIds.length > 4) {
      alert("최애 영화는 3개까지만 선택 가능합니다.");
      return;
    }
    console.log("삭제 후 " + selectedMovies);
    setIsSubmitting(true);

    try {
      await axios.put(
        `/api/mypage/enter/update`,
        {
          memberId: memberId,
          movieIds: selectedMovieIds,
        },
        { withCredentials: true }
      );
      console.log("제출할 movieIds:", selectedMovieIds);
      alert("영화가 수정되었습니다.");
      navigate("/mypage");
    } catch (err) {
      alert(err.response?.data || "제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="playlist-enter-container">
      <h2>마이페이지 영화 수정</h2>

      <section className="search-section">
        <input
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="영화 제목 검색"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          검색
        </button>
      </section>

      <section className="search-results">
        <h3>검색 결과</h3>
        {searchResults.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          <ul>
            {searchResults.map((movie) => (
              <li key={movie.movieId} className="movie-item">
                <strong>{movie.title}</strong> - {movie.genre}
                {/* <p className="movie-plot">{movie.plot}</p> */}
                <button
                  onClick={() => handleAddMovie(movie.movieId)}
                  className="add-btn"
                >
                  추가
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="selected-movies">
        <h3>선택된 영화 ({selectedMovies.length}/3)</h3>
        {selectedMovies.length === 0 ? (
          <p>선택된 영화가 없습니다.</p>
        ) : (
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
        )}
      </section>

      <section className="playlist-create">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="create-btn"
        >
          등록 완료
        </button>
      </section>
    </div>
  );
};

export default FavoriteMovieEdit;
