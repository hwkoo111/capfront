import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';


const SocialLoginCallback = () => {
  const { setIsLoggedIn, setNickname } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkNickname = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/auth/status', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('로그인 상태 확인 실패');

        const data = await res.json();

        if (!data.isLoggedIn) {
          alert('로그인되지 않았습니다.');
          navigate('/login');
          return;
        }

        if (!data.nickname || data.nickname.trim() === '') {
          const newNickname = window.prompt('사용할 닉네임을 입력해주세요.');
          if (newNickname && newNickname.trim() !== '') {
            const updateRes = await fetch('/api/user/set-nickname', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nickname: newNickname.trim() }),
            });

            if (!updateRes.ok) {
              alert('닉네임 설정 실패');
              navigate('/login');
              return;
            }

            setNickname(newNickname.trim());
            localStorage.setItem('nickname', newNickname.trim());
            alert('닉네임이 설정되었습니다.');
          } else {
            alert('닉네임 설정이 필요합니다.');
            navigate('/login');
            return;
          }
        } else {
          console.log('기존 닉네임 사용:', data.nickname);
          setNickname(data.nickname);
        }

        setIsLoggedIn(true);
        navigate('/'); // 원하면 홈으로 이동
      } catch (e) {
        alert('오류 발생: ' + e.message);
        navigate('/login');
      }
    };

    checkNickname();
  }, [setIsLoggedIn, setNickname, navigate]);

  return null; // UI 표시 없음
};

export default SocialLoginCallback;
