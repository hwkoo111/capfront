package deu.movietalk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunitySummaryDto {
    private Long postId;
    private String title;
    private String nickname;
    private String createdAt;

}
