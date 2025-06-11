package deu.movietalk.service;

import deu.movietalk.domain.Member;
import deu.movietalk.domain.Movie;
import deu.movietalk.domain.Review;
import deu.movietalk.dto.ReviewAverageDto;
import deu.movietalk.dto.ReviewDto;
import deu.movietalk.dto.ReviewResponseDto;
import deu.movietalk.repository.MemberRepository;
import deu.movietalk.repository.MovieRepository;
import deu.movietalk.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본은 읽기 전용 트랜잭션
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;
    private final MovieRepository movieRepository;

    // 리뷰 생성
    @Transactional
    public void createReview(String memberId, ReviewDto dto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));
        Movie movie = movieRepository.findById(dto.getMovieId())
                .orElseThrow(() -> new IllegalArgumentException("영화가 존재하지 않습니다."));

        boolean alreadyReviewed = reviewRepository.existsByMemberAndMovie(member, movie);
        if (alreadyReviewed) {
            throw new IllegalArgumentException("이미 해당 영화에 대한 리뷰를 작성하셨습니다.");
        }

        // 리뷰 객체 생성 및 저장
        Review review = new Review();
        review.setMember(member);
        review.setMovie(movie);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        reviewRepository.save(review); // 리뷰 저장
    }

    // 영화에 대한 모든 리뷰 조회 (fetch join)
    public List<ReviewResponseDto> getReviewsByMovie(Long movieId) {
        List<Review> reviews = reviewRepository.findByMovieIdWithMember(movieId);

        return reviews.stream()
                .map(r -> new ReviewResponseDto(
                        r.getReviewId(),
                        r.getMember().getNickname(),
                        r.getRating(),
                        r.getComment()))
                .collect(Collectors.toList());
    }

    // 영화의 평균 별점 조회
    public ReviewAverageDto getAverageRating(Long movieId) {
        List<Review> reviews = reviewRepository.findByMovie_MovieId(movieId);

        double avg = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);

        return new ReviewAverageDto(movieId, avg, reviews.size());
    }

    // 리뷰 수정
    @Transactional
    public void updateReview(Long reviewId, String memberId, ReviewDto dto) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰가 존재하지 않습니다."));

        if (!review.getMember().getMemberId().equals(memberId)) {
            throw new IllegalArgumentException("리뷰 수정 권한이 없습니다.");
        }

        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        reviewRepository.save(review);
    }

    // 리뷰 삭제
    @Transactional
    public void deleteReview(Long reviewId, String memberId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰가 존재하지 않습니다."));

        if (!review.getMember().getMemberId().equals(memberId)) {
            throw new IllegalArgumentException("리뷰 삭제 권한이 없습니다.");
        }

        reviewRepository.delete(review);
    }
}