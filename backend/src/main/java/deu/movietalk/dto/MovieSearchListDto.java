package deu.movietalk.dto;

import deu.movietalk.domain.Movie;
import lombok.Getter;

@Getter
public class MovieSearchListDto {

    private Long movieId;
    private String title;
    private String posterUrl;

    public MovieSearchListDto(Movie movie) {
        this.movieId = movie.getMovieId();
        this.title = movie.getTitle();
        this.posterUrl = movie.getPosterUrl();
    }
}