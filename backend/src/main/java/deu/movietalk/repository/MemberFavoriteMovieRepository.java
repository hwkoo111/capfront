package deu.movietalk.repository;

import deu.movietalk.domain.Member;
import deu.movietalk.domain.MemberFavoriteMovie;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MemberFavoriteMovieRepository extends JpaRepository<MemberFavoriteMovie, Long> {
    void deleteByMember_MemberId(String memberId); // 'member' 엔티티의 'id' 속성에 접근
    @Query("SELECT mfm FROM MemberFavoriteMovie mfm WHERE mfm.member.id = :memberId AND mfm.movie.id = :movieId")
    Optional<MemberFavoriteMovie> findByMemberIdAndMovieId(String memberId, Long movieId);

    // memberId로 모든 즐겨찾기 영화 조회
    List<MemberFavoriteMovie> findByMember_MemberId(String memberId);

}
