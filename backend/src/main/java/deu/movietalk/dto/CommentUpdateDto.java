package deu.movietalk.dto;

import lombok.*;

@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentUpdateDto {
    private String content;
}
