package deu.movietalk.controller;

import deu.movietalk.dto.ReviewAverageDto;
import deu.movietalk.dto.ReviewDto;
import deu.movietalk.dto.ReviewResponseDto;
import deu.movietalk.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<String> createReview(@RequestBody ReviewDto dto,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }
            String memberId = userDetails.getUsername();
            reviewService.createReview(memberId, dto);
            return ResponseEntity.ok("리뷰가 성공적으로 등록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("리뷰 등록에 실패했습니다.");
        }
    }


    // 특정 영화에 대한 리뷰 목록
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviews(@PathVariable Long movieId) {
        return ResponseEntity.ok(reviewService.getReviewsByMovie(movieId));
    }

    // 특정 영화에 대한 평균 별점
    @GetMapping("/movie/{movieId}/average")
    public ResponseEntity<ReviewAverageDto> getAverage(@PathVariable Long movieId) {
        return ResponseEntity.ok(reviewService.getAverageRating(movieId));
    }

    // 리뷰 수정
    @PutMapping("/{reviewId}")
    public ResponseEntity<String> updateReview(@PathVariable Long reviewId, @RequestBody ReviewDto dto, @AuthenticationPrincipal UserDetails userDetails) {
        String memberId = userDetails.getUsername();
        try {
            reviewService.updateReview(reviewId, memberId, dto);
            return ResponseEntity.ok("리뷰가 성공적으로 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage()); // 잘못된 입력에 대한 오류 응답
        }
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId, @AuthenticationPrincipal UserDetails userDetails) {
        String memberId = userDetails.getUsername();
        try {
            reviewService.deleteReview(reviewId, memberId);
            return ResponseEntity.ok("리뷰가 성공적으로 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage()); // 잘못된 입력에 대한 오류 응답
        }
    }
}
