package deu.movietalk.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "member")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Member {
    @Id
    @Column(name="member_id")
    private String memberId;

    @Column
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(nullable = true,unique=true)
    private String nickname;
    @Column(nullable = false)
    private String role;
    @OneToMany(mappedBy = "member",cascade = CascadeType.ALL)
    private List<CommunityPost> communityPostList = new ArrayList<>();

    @OneToMany(mappedBy = "member",cascade = CascadeType.ALL)
    private List<CommunityComment> communityCommentList = new ArrayList<>();

    @OneToMany(mappedBy = "member",cascade = CascadeType.ALL)
    private List<MemberFavoriteMovie> memberFavoriteMovieList = new ArrayList<>();

    @OneToMany(mappedBy = "member",cascade = CascadeType.ALL)
    private List<PlayList> playListList = new ArrayList<>();

    @OneToMany(mappedBy = "member",cascade = CascadeType.ALL)
    private List<Review> reviewList = new ArrayList<>();
}