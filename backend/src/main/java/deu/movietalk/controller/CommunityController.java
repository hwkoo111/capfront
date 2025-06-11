package deu.movietalk.controller;

import deu.movietalk.domain.CommunityPost;
import deu.movietalk.dto.*;
import deu.movietalk.service.CommunityService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/community")
@AllArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    //게시글 작성
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/enter/posts")
    public ResponseEntity<CommunityDto> createPost(@RequestBody CommunityDto communityDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String memberId = authentication.getName(); // JWT에서 추출한 memberId
        System.out.println(memberId);
        CommunityDto saved = communityService.createPost(communityDto, memberId);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    //게시글 조회(내용x)
    @GetMapping("/posts")
    public ResponseEntity<?> getPostSummaries(@RequestParam(defaultValue = "0") int page) {
        if (page < 0) {
            return ResponseEntity.badRequest().body("잘못된 페이지 번호입니다.");
        }
        try {
            Pageable pageable = PageRequest.of(page, 10, Sort.by("createdAt").descending());
            Page<CommunitySummaryDto> posts = communityService.getPostSummaries(pageable);

            if (posts.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("게시글이 없습니다.");
            }
            return ResponseEntity.ok(posts);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 조회 중 오류가 발생했습니다.");
        }
    }

    //게시글 상세조회
    @GetMapping("/posts/{postId}")
    public ResponseEntity<?> getPostDetail(@PathVariable Long postId) {
        try {
            CommunityDetailDto dto = communityService.getPostWithComments(postId);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    //게시글 카레고리별 조회
    @GetMapping("/posts/category/{categoryId}")
    public ResponseEntity<?> getPostsByCategory(@PathVariable Long categoryId,
                                                @RequestParam(defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by("createdAt").descending());
        Page<CommunitySummaryDto> posts = communityService.getPostsByCategory(categoryId, pageable);

        if (posts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("해당 카테고리의 게시글이 없습니다.");
        }
        return ResponseEntity.ok(posts);
    }
    //게시글 삭제
    @DeleteMapping("/enter/delete/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String memberId = authentication.getName();

            communityService.deletePost(postId, memberId);
            return ResponseEntity.ok("게시글이 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 삭제 중 오류 발생");
        }
    }
    // 게시글 수정
    @PutMapping("/enter/put/{postId}")
    public ResponseEntity<String> updatePost(@PathVariable Long postId,
                                             @RequestBody CommunityUpdateDto dto) {
        try {
            String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
            communityService.updatePost(postId, memberId, dto);
            return ResponseEntity.ok("게시글이 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 수정 중 오류 발생");
        }
    }
    @GetMapping("/posts/search")
    public ResponseEntity<?> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1") Long categoryId) {  // 카테고리 ID 추가

        if (keyword.isBlank()) {
            return ResponseEntity.badRequest().body("검색어는 필수입니다.");
        }

        Pageable pageable = PageRequest.of(page, 10, Sort.by("createdAt").descending());

        try {
            Page<CommunitySummaryDto> results = communityService.searchPosts(keyword, categoryId, pageable);
            if (results.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("검색 결과가 없습니다.");
            }
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("검색 중 오류가 발생했습니다.");
        }
    }
    // 댓글 수정
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<String> updateComment(@PathVariable Long commentId,
                                                @RequestBody CommentUpdateDto dto) {
        try {
            String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
            communityService.updateComment(commentId, memberId, dto);
            return ResponseEntity.ok("댓글이 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 수정 중 오류 발생");
        }
    }
    //댓글 등록
    @PostMapping("/enter/{postId}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long postId,
                                        @RequestBody CommentCreateDto dto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String memberId = authentication.getName(); // JWT에서 추출
            System.out.println(memberId);
            communityService.addComment(postId, memberId, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("댓글이 등록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 등록 중 오류 발생");
        }
    }

    //댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String memberId = authentication.getName();

            communityService.deleteComment(commentId, memberId);
            return ResponseEntity.ok("댓글이 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 삭제 중 오류 발생");
        }
    }
}