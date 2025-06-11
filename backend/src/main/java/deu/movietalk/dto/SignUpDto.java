package deu.movietalk.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpDto {
    private String id;
    private String email;
    private String nickname;
    private String password;
}