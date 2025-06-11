package deu.movietalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlayListViewDto {
    private Long playListId;
    private String playListName;
    private String playListDate;
    private String memberNickname;
}
