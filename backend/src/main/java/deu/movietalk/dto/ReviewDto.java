package deu.movietalk.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewDto {
    private Long movieId;
    private double rating;
    private String comment;
}