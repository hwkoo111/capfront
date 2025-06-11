package deu.movietalk.repository;

import deu.movietalk.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,String> {
    Member findByMemberId(String memberId);
    Boolean existsByNickname(String nickname);
    Optional<Member> findNicknameByMemberId(String memberId);
    Optional<Member> findByNickname(String nickname);
    boolean existsByEmail(String email);
}