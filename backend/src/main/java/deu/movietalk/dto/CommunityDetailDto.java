package deu.movietalk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityDetailDto {
    private Long postId;
    private String title;
    private String content;
    private String nickname;
    private String createdAt;
    private List<CommentDto> comments;
}