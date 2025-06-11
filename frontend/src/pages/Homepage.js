import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Homepage.css';
import '../styles/ChatGPTBox.css';
import searchicon from "../assets/mainpage/search.png";
import MovieSection from '../components/Movies/MovieSection';
import ChatGPTBox from './ChatGPTBox';
import logo from "../assets/logo.png";

const MovieList = () => {
  const [movies, setMovies] = useState({});
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색어
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearch, setIsSearch] = useState(false); // 검색 상태 여부
  const [isChatVisible, setIsChatVisible] = useState(false); // 챗박스 표시 여부
  const [messages, setMessages] = useState([]); // 챗봇 메시지 상태
  const [input, setInput] = useState(''); // 입력값 상태
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      alert(location.state.successMessage);
    }
  }, [location]);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movie');
      if (!response.ok) {
        throw new Error('영화 데이터를 가져오는 데 실패했습니다.');
      }
      const data = await response.json();
      console.log(data);
      setMovies(data);
      setIsSearch(false); // 기본 목록 표시 상태로 변경
    } catch (error) {
      setErrorMessage(error.message);
      setMovies({});
    }
  };

  useEffect(() => {
    fetchMovies(); // 페이지 로드 시 기본 영화 목록 가져오기
  }, []);

  const searchMovies = async () => {
    if (!searchKeyword.trim()) {  //검색어 없으면
      setIsSearch(false); // 기본 목록 표시
      fetchMovies();
      return;
    }
    try {
      const response = await fetch(`/api/movie/search?keyword=${searchKeyword.trim()}`);
      if (!response.ok) {
        throw new Error('영화 검색에 실패했습니다.');
      }
      const data = await response.json();
      setMovies({ '검색결과': data });
      setIsSearch(true); // 검색 결과 상태로 변경
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
      setMovies({});
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchMovies(); // Enter 키가 눌리면 searchMovies 실행
    }
  };

  const getMovies = (genre) => {
    if (genre === '검색결과') {
      return Array.isArray(movies['검색결과']) 
        ? movies['검색결과'].map(movie => ({
            ...movie, 
            id: movie.movieId,
          })) 
        : [];
    }
    return Array.isArray(movies[genre]) ? movies[genre] : [];
  };

  const toggleChat = () => {
    setIsChatVisible(prevState => !prevState); // 챗박스 열기/닫기 토글
  };

  return (
    <>
      <div className="banner-area">
        <div className="image-43"></div>
        <div className='movietalk'>Movie Talk</div>
        <div className="search-container">
          <input 
            type="text" 
            className="searchbar" 
            placeholder="Search" 
            value={searchKeyword} 
            onChange={(e) => setSearchKeyword(e.target.value)} 
            onKeyDown={handleKeyDown}
          />
          <img 
            src={searchicon} 
            alt="검색 아이콘" 
            className="search-icon" 
            onClick={searchMovies}
          />
        </div>
      </div>

      <div className='movie-container'>
        {isSearch ? (
          <MovieSection 
            title="검색 결과" 
            movies={getMovies('검색결과')} 
            fallbackImage={logo} 
          />
        ) : (
          <>
            <MovieSection title="상영작" movies={getMovies('상영작')} fallbackImage={logo} />
            <MovieSection title="액션" movies={getMovies('액션')} fallbackImage={logo} />
            <MovieSection title="드라마" movies={getMovies('드라마')} fallbackImage={logo} />
            <MovieSection title="호러" movies={getMovies('호러')} fallbackImage={logo} />
          </>
        )}
      </div>

      <button onClick={toggleChat} className="chat-toggle-button">
        {isChatVisible ? '닫기' : '무엇이든 물어보세요!'}
      </button>

      {/* 챗봇 열기/닫기 */}
      {isChatVisible && (
        <ChatGPTBox 
          messages={messages} 
          setMessages={setMessages} 
          input={input} 
          setInput={setInput} 
        />
      )}
    </>
  );
};

export default MovieList;
