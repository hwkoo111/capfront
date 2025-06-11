package deu.movietalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PlayListUpdateRequestDto {
    private String newName;               // 새로운 플레이리스트 이름
    private List<Long> movieIdList;       // 새롭게 포함할 영화 ID 목록
}
