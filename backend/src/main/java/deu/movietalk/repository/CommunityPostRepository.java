package deu.movietalk.repository;

import deu.movietalk.domain.CommunityPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost,Long> {
    Page<CommunityPost> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String titleKeyword, String contentKeyword, Pageable pageable);

    @Query("SELECT cp FROM CommunityPost cp " +
            "WHERE (UPPER(cp.title) LIKE UPPER(:titleKeyword) ESCAPE '\\' " +
            "OR UPPER(cp.content) LIKE UPPER(:contentKeyword) ESCAPE '\\') " +
            "AND cp.communityCategory.categoryId = :categoryId")
    Page<CommunityPost> searchByTitleOrContentAndCategoryId(
            String titleKeyword, String contentKeyword, Long categoryId, Pageable pageable);
    // 카테고리별로 게시글을 찾는 메서드
    Page<CommunityPost> findByCommunityCategory_CategoryId(Long categoryId, Pageable pageable);
}