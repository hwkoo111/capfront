// src/components/MovieSection.jsx
import React from 'react';
import MovieCard from './MovieCard';



const MovieSection = ({ title, movies, fallbackImage }) => {
  return (
    <div className="movie-section">
      <h3>{title}</h3>
      {movies && movies.length > 0 ? (
        <div className="movie-items">
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} fallbackImage={fallbackImage} />
          ))}
        </div>
      ) : (
        <p>{title} 데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default MovieSection;
