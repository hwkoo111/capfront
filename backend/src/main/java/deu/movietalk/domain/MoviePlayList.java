package deu.movietalk.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="movie_play_list")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MoviePlayList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="movie_play_list_id")
    private Long moviePlayListId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "play_list_id", nullable = false)
    private PlayList playList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id",nullable = false)
    private Movie movie;

}