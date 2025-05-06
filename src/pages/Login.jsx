import React, { useState } from "react";
import "./Auth.css"; // 공통 스타일 파일

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`로그인 시도: ${username} / ${password}`);
    // TODO: api.login({ username, password })...
  };

  return (
    <section className="auth-container">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          아이디
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">로그인</button>
      </form>
    </section>
  );
}
