import api from "./index"; // axios 인스턴스

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
}

export interface PlaylistDetail {
  title: string;
  movies: Movie[];
}

// GET /api/playlists/{id}
export const fetchPlaylistDetail = async (
  id: string
): Promise<PlaylistDetail> => {
  const response = await api.get<PlaylistDetail>(`/playlists/${id}`);
  return response.data;
};
