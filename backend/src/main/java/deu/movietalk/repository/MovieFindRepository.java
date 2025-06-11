package deu.movietalk.repository;

import deu.movietalk.domain.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieFindRepository extends JpaRepository<Movie, Long> {

    // 필요 최소한의 필드만 불러오는 기본 검색 (JOIN 없음)
    @Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Movie> findByTitleContainingIgnoreCase(@Param("keyword") String keyword);
}