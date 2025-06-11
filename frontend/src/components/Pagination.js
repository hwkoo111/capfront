import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Pagination.css"; 

export default function Pagination({
  totalItems,
  itemCountPerPage,
  pageCount,
  currentPage,
  totalPages,
  onPageChange
}) {
  const [start, setStart] = useState(1);

  useEffect(() => {
    if (currentPage === start + pageCount) setStart((prev) => prev + pageCount);
    if (currentPage < start) setStart((prev) => prev - pageCount);
  }, [currentPage, pageCount, start]);

  // 페이지 번호를 1부터 totalPages까지 계산
  const pageNumbers = [];
  for (let i = start; i <= Math.min(start + pageCount - 1, totalPages); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="wrapper">
      <ul>
        {/* 이전 버튼 */}
        <li className={`move ${currentPage === 1 ? "invisible" : ""}`}>
          <Link to="#" onClick={() => onPageChange(currentPage - 1)}>&lt;</Link>
        </li>

        {/* 페이지 번호들 */}
        {pageNumbers.map((number) => (
          <li key={number}>
            <Link
              className={`page ${currentPage === number ? "active" : ""}`}
              to="#"
              onClick={() => onPageChange(number)}
            >
              {number}
            </Link>
          </li>
        ))}

        {/* 다음 버튼 */}
        <li className={`move ${currentPage === totalPages ? "invisible" : ""}`}>
          <Link to="#" onClick={() => onPageChange(currentPage + 1)}>&gt;</Link>
        </li>
      </ul>
    </div>
  );
}