// src/components/Movies/MovieSectionList.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../MovieSectionList.css';

const MovieSectionList = ({ movies, fallbackImage }) => (
  <div className="movie-list-items">
    {movies.length === 0 ? (
      <div className="movie-list-nodata">검색 결과가 없습니다.</div>
    ) : (
      movies.map(movie => (
        <div className="movie-list-card" key={movie.id}>
          <div className="movie-list-thumb">
            <img src={movie.posterUrl || fallbackImage} alt={movie.title} />
          </div>
          <div className="movie-list-info">
            <div className="movie-list-movietitle">{movie.title}</div>
            <div className="movie-list-metas">
              <span>{movie.genre}</span> · <span>{movie.director}</span>
            </div>
          </div>
          <Link to={`/movie/${movie.id}`} className="movie-list-detailbtn">More details</Link>
        </div>
      ))
    )}
  </div>
);

export default MovieSectionList;
