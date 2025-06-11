package deu.movietalk.repository;

import deu.movietalk.domain.Member;
import deu.movietalk.domain.Movie;
import deu.movietalk.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 특정 영화에 대한 모든 리뷰 조회 (기존 N+1 발생 가능)
    List<Review> findByMovie_MovieId(Long movieId);

    // N+1 문제 해결을 위한 fetch join 쿼리 (추천)
    @Query("SELECT r FROM Review r JOIN FETCH r.member WHERE r.movie.movieId = :movieId")
    List<Review> findByMovieIdWithMember(@Param("movieId") Long movieId);

    // 사용자가 이미 해당 영화에 대해 리뷰를 작성했는지 확인
    boolean existsByMemberAndMovie(Member member, Movie movie);

}