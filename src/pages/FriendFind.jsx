// src/pages/FriendFind.jsx
import React, { useState } from "react";

export default function FriendFind() {
  const [nickname, setNickname] = useState("");
  const [found, setFound] = useState("");

  const handleSearch = () => {
    // TODO: API 호출
    setFound(nickname || "");
  };

  return (
    <section>
      <h1>영화친구 찾기</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      {found && (
        <div style={{ background: "#fff", color: "#000", padding: "1rem" }}>
          유저 닉네임: <strong>{found}</strong>
        </div>
      )}
    </section>
  );
}
