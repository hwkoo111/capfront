import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../../assets/logo.png";
import "../../styles/PlaylistDetailPage.css";

const PlaylistDetailPage = () => {
  const { playListId } = useParams();  // URL에서 playListId를 추출
  const [playlistDetail, setPlaylistDetail] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 플레이리스트 상세 정보 API 호출
    const fetchPlaylistDetail = async () => {
      try {
        const response = await axios.get(`/api/playlist/view/${playListId}`);
        setPlaylistDetail(response.data);  // 상세 정보 저장
      } catch (error) {
        setError('플레이리스트 정보를 가져오는 데 실패했습니다.');
      }
    };

    fetchPlaylistDetail();
  }, [playListId]);  // playListId가 바뀔 때마다 다시 API 호출

  if (error) {
    return <div>{error}</div>;
  }

  if (!playlistDetail) {
    return <div>Loading...</div>;  // 데이터가 로딩 중일 때
  }

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  }

  return (
    <div className="playlist-detail">
  <h2>{playlistDetail.playListName}</h2>
  <p>작성자: {playlistDetail.writerName}</p>
  {/* <p>생성일: {playlistDetail.createdAt}</p> */}
  
  <h3>영화 리스트</h3>
  
  {/* 영화 항목 컨테이너 */}
  <div className="movie-container">
    {/* 각 영화 항목 */}
    <div className="movie-items">
      {playlistDetail.movies.length === 0 ? (
        <p>현재 등록된 영화가 없습니다.</p>
      ) : (
        playlistDetail.movies.map((movie, index) => (
          <div key={index} className="movie-item" onClick={() => handleMovieClick(movie.movieId)} style={{ cursor: 'pointer' }}>
            <div className="movie-category">
              <h4>{movie.title}</h4>
              <p>추천</p>
              <img src={movie.posterUrl || logo} alt={movie.title} />
            </div>
          </div>
        ))
      )}
    </div>
  </div>
</div>

  );
};

export default PlaylistDetailPage;
