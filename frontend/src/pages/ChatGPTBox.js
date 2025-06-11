import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ChatGPTBox.css';

const ChatGPTBox = ({ messages, setMessages, input, setInput }) => {
  const [loading, setLoading] = useState(false);

  // 페이지가 로드될 때 이전 대화 내역을 localStorage에서 불러오기
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const storedInput = localStorage.getItem('chatInput') || '';
    
    setMessages(storedMessages);
    setInput(storedInput);
  }, [setMessages, setInput]);

  // 대화가 추가될 때마다 메시지를 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    localStorage.setItem('chatInput', input);
  }, [messages, input]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/chatgpt', // 백엔드 API 경로
        {
          model: 'gpt-4o',
          messages: newMessages,  // 메시지 배열 전송
        }
      );

      const reply = response.data.choices[0].message;
      setMessages([...newMessages, reply]);
    } catch (err) {
      console.error('ChatGPT 응답 실패:', err);
      setMessages([...newMessages, { role: 'assistant', content: '답변 생성에 실패했습니다.' }]);
    }

    setLoading(false);
  };

  return (
    <div className="chatgpt-box">
      <div className="chatgpt-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? '👤' : '🤖'}</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="loading">답변 생성 중...</div>}
      </div>

      <div className="chatgpt-input-row">
        <input
          type="text"
          placeholder="질문을 입력하세요..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>전송</button>
      </div>
    </div>
  );
};

export default ChatGPTBox;
