package deu.movietalk.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateFavoriteMovie {
    private String memberId;
    private List<Long> movieIds;

}
