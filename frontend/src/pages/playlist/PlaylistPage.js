import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Pagination from '../../components/Pagination';
import "../../styles/PlaylistPage.css";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';   // 추가

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemCountPerPage = 10;
  const pageCount = 5;
  const navigate = useNavigate();

  const { isLoggedIn, nickname } = useContext(AuthContext); // 추가

  const filteredPlaylists = playlists.filter(p =>
    p.playListName.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );
  const totalPages = Math.ceil(filteredPlaylists.length / itemCountPerPage);
  const currentItems = filteredPlaylists.slice(
    (currentPage - 1) * itemCountPerPage,
    currentPage * itemCountPerPage
  );

  useEffect(() => {
    axios.get('/api/playlist/view').then(res => setPlaylists(res.data));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/playlist/enter/delete/${id}`, { withCredentials: true });
      setPlaylists(playlists.filter(p => p.playListId !== id));
    } catch (err) {
      alert('삭제 실패');
    }
  }

  return (
    <div className="playlist-container">
      <div className="playlist-title">Playlist</div>
      <div className="playlist-search-row">
        <input
          type="text"
          className="playlist-search-input"
          placeholder="플레이리스트 검색"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button className="write-btn" onClick={() => navigate('/playlist/create')}>작성</button>
      </div>
      <div className="playlist-header-row">
        <span>플레이리스트명</span>
        <span>게시일</span>
        <span>작성자</span>
      </div>
      <ul className="playlist-list">
        {currentItems.map((playlist) => (
          <li key={playlist.playListId} className="playlist-card">
            <div className="playlist-card-row">
              <Link to={`/playlist/view/${playlist.playListId}`} className="playlist-card-title">
                {playlist.playListName}
              </Link>
              <div className="playlist-card-date">
                {playlist.playListDate ? playlist.playListDate.slice(0, 10).replace(/-/g, ".") : ""}
              </div>
              <div className="playlist-card-author">{playlist.memberNickname}</div>
              {/* 조건부 렌더링 (본인만) */}
              {isLoggedIn && nickname === playlist.memberNickname && (
                <div className="playlist-card-actions">
                  <button onClick={() => navigate(`/playlist/put/${playlist.playListId}`)}>수정</button>
                  <button onClick={() => handleDelete(playlist.playListId)}>삭제</button>
                </div>
              )}
            </div>
          </li>
        ))}
        {currentItems.length === 0 && (
          <li className="playlist-item-empty">검색 결과가 없습니다.</li>
        )}
      </ul>
      <div className="pagination-wrapper">
        <Pagination
          totalItems={filteredPlaylists.length}
          itemCountPerPage={itemCountPerPage}
          pageCount={pageCount}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default PlaylistPage;
