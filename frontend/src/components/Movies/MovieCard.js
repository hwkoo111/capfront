import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, fallbackImage }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // 클릭한 영화의 ID를 이용해 상세 페이지로 이동
    if (movie.id) {
      navigate(`/movie/${movie.id}`);
    } else {
      console.error("영화 ID가 없습니다:", movie);
    }
  };

  return (
    <div className="movie-item card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img
        src={movie.posterUrl || fallbackImage}
        alt={movie.title}
        className="movie-item-img"
        style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '15px' }}
      />
      <div className="movie-item-title">{movie.title}</div>
    </div>
  );
};

export default MovieCard;
