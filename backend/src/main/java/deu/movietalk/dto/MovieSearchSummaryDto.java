package deu.movietalk.dto;

import deu.movietalk.domain.Movie;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MovieSearchSummaryDto {
    private Long movieId;
    private String title;
    private String titleEng;
    private Integer createDts;
    private String genre;
    private String plot;

    public static MovieSearchSummaryDto fromEntity(Movie movie) {
        MovieSearchSummaryDto dto = new MovieSearchSummaryDto();
        dto.setMovieId(movie.getMovieId());
        dto.setTitle(movie.getTitle());
        dto.setTitleEng(movie.getTitleEng());
        dto.setCreateDts(movie.getCreateDts());
        dto.setGenre(movie.getGenre());
        dto.setPlot(movie.getPlot());
        return dto;
    }



}
