package deu.movietalk.dto;

import lombok.*;

@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommunityUpdateDto {
    private String title;
    private String content;
}
