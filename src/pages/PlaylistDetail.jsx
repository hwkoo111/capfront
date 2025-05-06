import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { fetchPlaylistDetail } from "../api/playlistService";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!playlistId) return;

    setLoading(true);
    fetchPlaylistDetail(playlistId)
      .then((data) => {
        setPlaylist(data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("플레이리스트를 불러오던 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [playlistId]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!playlist) return null;

  return (
    <section>
      <h1>{playlist.title}</h1>
      <button onClick={() => navigate("/playlist")}>뒤로가기</button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px,1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {playlist.movies.map((m) => (
          <MovieCard key={m.id} {...m} />
        ))}
      </div>
    </section>
  );
}
