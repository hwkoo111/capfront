package deu.movietalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class UpdateNicknameRequest {
    private String memberId;
    private String newNickname;
}
