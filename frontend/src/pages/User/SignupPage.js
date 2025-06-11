import React, { useState } from 'react';
import axios from 'axios'; // axios import
import { useNavigate } from 'react-router-dom'; // useNavigate import
import "../../styles/SignupPage.css";

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();  // useNavigate 훅 사용

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    
    const signUpData = {
      id: username,
      email: email,
      nickname: nickname,
      password: password,
    };
    
    try {
      // 백엔드 API로 POST 요청 보내기
      const response = await axios.post('/signup', signUpData);
      
      // 성공적인 회원가입
      setSuccessMessage(response.data);  // 성공 메시지
      setErrorMessage('');  // 에러 메시지 초기화

      // 회원가입 완료 후 알림창 띄우기
      window.alert('회원가입이 완료되었습니다!');
      
      // 홈 화면으로 리디렉션
      navigate('/');  // Homepage.js로 리디렉션
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data);  // 서버에서 반환한 오류 메시지
      } else {
        setErrorMessage('회원가입 중 오류 발생');
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* ✅ 여기 추가 */}
        
        <input
          type="text"
          className="input-field"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <input
          type="email"
          className="input-field"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="input-field"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          className="input-field"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        <input
          type="text"
          className="input-field"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        
        <button type="submit" className="signup-btn">회원가입</button>
      </form>
    </div>
  );
};

export default SignupPage;
