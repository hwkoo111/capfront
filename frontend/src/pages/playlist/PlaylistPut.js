import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "../../styles/PlaylistEnter.css";

const PlaylistPut = ({onSuccessRedirect = "/playlist"}) => {
  const { playListId } = useParams();
  const navigate = useNavigate();

  const [playlistName, setPlaylistName] = useState('');
  const [originalPlaylistName, setOriginalPlaylistName] = useState(''); // 기존 이름 저장
  const [selectedMovieIds, setSelectedMovieIds] = useState([]); // 영화 id 리스트만 저장
  const [selectedMovies, setSelectedMovies] = useState([]); // 영화 상세 정보 리스트
  const [searchResults, setSearchResults] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. 플레이리스트 기본 정보 조회
        const resName = await axios.get(`/api/playlist/view/${playListId}`, { withCredentials: true });
        setPlaylistName(resName.data.playListName);
        setOriginalPlaylistName(resName.data.playListName); // 기존 이름 저장

        // 2. 수정용 영화 목록 조회 (별도 API)
        const resMovies = await axios.get(`/api/playlist/enter/put/movieList/${playListId}`, { withCredentials: true });
        if (resMovies.data && Array.isArray(resMovies.data)) {
          const movieIds = resMovies.data
            .map(movie => movie.movieId)
            .filter(id => id != null);

          localStorage.setItem(`playlist_${playListId}_movies`, JSON.stringify(movieIds));
          setSelectedMovieIds(movieIds);
          setSelectedMovies(resMovies.data);
        } else {
          localStorage.removeItem(`playlist_${playListId}_movies`);
          setSelectedMovieIds([]);
          setSelectedMovies([]);
        }

        setIsLoading(false);
      } catch (e) {
        alert('플레이리스트 정보를 불러오지 못했습니다.');
        navigate(onSuccessRedirect);
      }
    };
    fetchInitialData();
  }, [playListId, navigate]);

  // 영화 검색
  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }
    try {
      const res = await axios.get(`/api/playlist/enter/search?keyword=${keyword}`);
      setSearchResults(res.data);
    } catch {
      alert('검색 실패');
    }
  };

  // 영화 추가
  const handleAddMovie = (movie) => {
    if (!movie.movieId) {
      alert('유효하지 않은 영화입니다.');
      return;
    }
    if (selectedMovieIds.includes(movie.movieId)) {
      alert('이미 선택한 영화입니다.');
      return;
    }

    const updatedIds = [...selectedMovieIds, movie.movieId];
    const updatedMovies = [...selectedMovies, movie];

    setSelectedMovieIds(updatedIds);
    setSelectedMovies(updatedMovies);

    localStorage.setItem(`playlist_${playListId}_movies`, JSON.stringify(updatedIds));
  };

  // 영화 삭제
  const handleRemoveMovie = (movieId) => {
    const updatedIds = selectedMovieIds.filter(id => id !== movieId);
    const updatedMovies = selectedMovies.filter(m => m.movieId !== movieId);

    setSelectedMovieIds(updatedIds);
    setSelectedMovies(updatedMovies);

    localStorage.setItem(`playlist_${playListId}_movies`, JSON.stringify(updatedIds));
  };

  // 플레이리스트 수정 제출
  const handleUpdatePlaylist = async () => {
  if (!playlistName.trim()) {
    alert('플레이리스트 이름을 입력하세요.');
    return;
  }
  if (selectedMovieIds.length === 0) {
    alert('선택된 영화가 없습니다.');
    return;
  }

  // 항상 현재 입력된 이름을 보내도록 처리 (수정 여부 관계없이)
  const nameToSend = playlistName;

  try {
    await axios.put(
      `/api/playlist/enter/put/${playListId}`,
      { newName: nameToSend, movieIdList: selectedMovieIds },
      { withCredentials: true }
    );
    alert('플레이리스트가 수정되었습니다.');
    localStorage.removeItem(`playlist_${playListId}_movies`);
    navigate(onSuccessRedirect);
  } catch {
    alert('수정 실패');
  }
};

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <div className="playlist-enter-container">
      <h2>플레이리스트 수정</h2>

      <section className="playlist-name-section">
        <input
          value={playlistName}
          onChange={e => setPlaylistName(e.target.value)}
          placeholder="플레이리스트 이름"
          className="playlist-name-input"
        />
      </section>

      <section className="search-section">
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="영화 제목 검색"
          className="search-input"
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} className="search-btn">검색</button>
      </section>

      <section className="search-results">
        <h3>검색 결과</h3>
        {searchResults.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          <ul>
            {searchResults.map(movie => (
              <li key={movie.movieId} className="movie-item">
                <strong>{movie.title}</strong> ({movie.createDts}) - {movie.genre}
                {/* <p className="movie-plot">{movie.plot}</p> */}
                <button onClick={() => handleAddMovie(movie)} className="add-btn">선택</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="selected-movies">
        <h3>선택된 영화 ({selectedMovies.length})</h3>
        {selectedMovies.length === 0 ? (
          <p>영화를 선택해 주세요.</p>
        ) : (
          <ul>
            {selectedMovies.map(movie => (
              <li key={movie.movieId} className="selected-movie-item">
                {movie.title}
                <button onClick={() => handleRemoveMovie(movie.movieId)} className="remove-btn"> 삭제</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="playlist-create">
        <button onClick={handleUpdatePlaylist} className="create-btn">변경</button>
      </section>
    </div>
  );
};

export default PlaylistPut;
