package deu.movietalk.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "member_favorite_movie", uniqueConstraints = {          //멤버가 같은 영화 중복 등록 지정 x
        @UniqueConstraint(columnNames = {"member_id", "movie_id"})
})
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MemberFavoriteMovie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;
}