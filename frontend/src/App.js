import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './auth/LoginForm';
import Homepage from './pages/Homepage';
import PlaylistPage from './pages/playlist/PlaylistPage';
import PlaylistDetailPage from './pages/playlist/PlaylistDetailPage';
import PlaylistEnter from './pages/playlist/PlaylistEnter';
import PlaylistPut from './pages/playlist/PlaylistPut';
import FindFriendPage from './pages/FindFriend/FindFriendPage';
import MovieDetail from './pages/Movie/MovieDetailPage';
import Navigation from './components/Navigation';
import SignupPage from './pages/User/SignupPage';
import SocialLoginCallback from './pages/User/SocialLoginCallback';
import MyPage from './pages/Mypage/MyPage';
import CommunityPage from './pages/Community/CommunityPage';
import CommunityWritePage from './pages/Community/CommunityWritePage'; 
import PostDetailPage from './pages/Community/CommunityDetail';
import FavoriteMovieEdit from './pages/Mypage/FavoriteMovieEdit';
import { AuthProvider } from './auth/AuthContext';
import CommunityPut from './pages/Community/CommunityPut';



const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          {/* 메인 및 인증 */}
          <Route path="/" element={<Homepage />} />
          <Route path="/movie/:movieId" element={<MovieDetail />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth2/callback" element={<SocialLoginCallback />} />
          <Route path="/community/put/:postId" element={<CommunityPut />} />


          {/* 플레이리스트 */}
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/playlist/view/:playListId" element={<PlaylistDetailPage />} />
          <Route path="/playlist/create" element={<PlaylistEnter />} />
          <Route path="/playlist/put/:playListId" element={<PlaylistPut onSuccessRedirect="/mypage"/>} />

          {/* 마이페이지/영화 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/edit" element={<FavoriteMovieEdit />} />
          

          {/* 커뮤니티 게시판 */}
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/write" element={<CommunityWritePage />} /> {/* 글쓰기 */}
          <Route path="/community/post/:postId" element={<PostDetailPage />} />
          {/* 친구찾기 */}
          <Route path="/findfriend" element={<FindFriendPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;