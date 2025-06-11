package deu.movietalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReviewAverageDto {
    private Long movieId;
    private double averageRating;
    private int totalReviews;
}