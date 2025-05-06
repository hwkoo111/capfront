import React, { useState } from "react";
import "./Auth.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    alert(`회원가입 시도: ${username} / ${password}`);
    // TODO: api.signup({ username, password })...
  };

  return (
    <section className="auth-container">
      <h1>회원가입</h1>
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
        <label>
          비밀번호 확인
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>
        <button type="submit">회원가입</button>
      </form>
    </section>
  );
}
