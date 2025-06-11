package deu.movietalk.repository;

import deu.movietalk.domain.Movie;
import deu.movietalk.dto.MovieSearchSummaryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByTitleIn(List<String> title);
    @Query("SELECT new deu.movietalk.dto.MovieSearchSummaryDto(m.movieId, m.title, m.titleEng, m.createDts, m.genre, m.plot) " +
            "FROM Movie m WHERE REPLACE(m.title, ' ', '') LIKE %:keyword%")
    List<MovieSearchSummaryDto> searchByTitleIgnoreSpace(@Param("keyword") String keyword);
    // 최신순으로 최대 100개 받아서 서비스 단에서 날짜 필터링
    List<Movie> findTop100ByPosterUrlIsNotNullOrderByReleaseDtsDesc();

    // '스릴러' 포함 장르 영화 중 포스터가 있는 영화 10개 (서비스단에서 5개 자름)
    List<Movie> findTop10ByGenreContainingIgnoreCaseAndPosterUrlIsNotNullOrderByReleaseDtsDesc(String genre);

}
