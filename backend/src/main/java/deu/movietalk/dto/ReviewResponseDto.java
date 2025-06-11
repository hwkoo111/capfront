package deu.movietalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReviewResponseDto {
    private Long reviewId;
    private String nickname;
    private double rating;
    private String comment;
}
