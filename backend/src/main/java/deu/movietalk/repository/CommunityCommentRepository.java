package deu.movietalk.repository;

import deu.movietalk.domain.CommunityComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityCommentRepository extends JpaRepository<CommunityComment, Long> {
}