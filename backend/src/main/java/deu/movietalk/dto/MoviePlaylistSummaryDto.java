package deu.movietalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;


@Getter
@AllArgsConstructor
public class MoviePlaylistSummaryDto {
    private Long movieId;
    private String title;
    private String titleEng;
    private String posterUrl;
}