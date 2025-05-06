// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // App.jsx 를 정확히 가리키는지
import "./index.css"; // 전역 스타일 (선택)

ReactDOM.createRoot(
  document.getElementById("root") // ▶ index.html 의 <div id="root">
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
