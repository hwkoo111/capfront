package deu.movietalk.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FindFriendMovieDto {
    private String nickname;
    private List<MoviePlaylistSummaryDto> moviePlaylistSummaryDtos;
}
