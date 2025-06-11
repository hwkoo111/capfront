import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // ✅ 추가
import '../styles/LoginForm.css';  // CSS 파일 import
import naverLoginBtn from '../assets/btnW_축약형.png';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn, setNickname,checkLoginStatus  } = useContext(AuthContext);

 const handleNaverLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
  };

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('nickname', data.nickname);
        console.log(document.cookie);
        // 토큰 저장 후 콘솔로 출력해보기
        console.log("저장된 토큰:", localStorage.getItem('token')); // 로컬스토리지에서 저장된 토큰 출력
  
        // 상태 갱신
        await checkLoginStatus();  // 상태 갱신 담당 함수, 여기서 setIsLoggedIn, setNickname 호출 중
  

   
      setSuccessMessage('로그인 성공!');
      setErrorMessage('');
      navigate('/');
      } else {
        setErrorMessage('잘못된 아이디 또는 비밀번호입니다.');
      }
    } catch (error) {
      setErrorMessage('서버와의 연결에 실패했습니다.');
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="username">사용자명:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="input-field" />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" />
        </div>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="submit-btn">로그인</button>
        {/* 네이버 로그인 버튼 추가 */}
<div className="naver-login-wrapper" style={{ marginTop: '20px' }}>
  <img
    src={naverLoginBtn}
    alt="네이버 로그인"
    className="naver-login-btn"
    onClick={handleNaverLogin}
  />
</div>
      </form>
    </div>
  );
};

export default LoginForm;
