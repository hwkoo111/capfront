package deu.movietalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
public class PlayListDetailDto {
    private String playListName;
    private String writerName;
    private String createdAt;
    private List<MoviePlaylistSummaryDto> movies;

}
