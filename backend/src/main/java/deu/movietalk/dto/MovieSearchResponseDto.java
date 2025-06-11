package deu.movietalk.dto;

import deu.movietalk.domain.Movie;
import lombok.Getter;

@Getter
public class MovieSearchResponseDto {

    private Long movieId;
    private String title;
    private String genre;
    private String director;
    private String actor;
    private String plot;
    private Integer runtime;
    private String rating;
    private String releaseDts;
    private String posterUrl;

    // 생성자: 리뷰 제외하고 영화 정보만 세팅
    public MovieSearchResponseDto(Movie movie) {
        this.movieId = movie.getMovieId();
        this.title = movie.getTitle();
        this.genre = movie.getGenre();
        this.director = movie.getDirector();
        this.actor = movie.getActor();
        this.plot = movie.getPlot();
        this.runtime = movie.getRuntime();
        this.rating = movie.getRating();
        this.releaseDts = movie.getReleaseDts();
        this.posterUrl = movie.getPosterUrl();
    }
}