package deu.movietalk.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="movie")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Long movieId;

    @Column(name = "create_dts")
    private Integer createDts;

    @Column(name = "release_dts")
    private String  releaseDts;

    private String nation;

    private String genre;

    @Column(name = "movie_seq")
    private Long movieSeq;

    private String title;

    private String director;

    @Column(length = 500)
    private String actor;

    @Column(length = 2000)
    private String plot;

    @Column(name = "title_eng")
    private String titleEng;

    private Integer runtime;

    private String rating;

    @Column(name = "poster_url")
    private String posterUrl;

    @OneToMany(mappedBy = "movie",cascade = CascadeType.ALL)
    private List<MemberFavoriteMovie> memberFavoriteMovieList = new ArrayList<>();

    @OneToMany(mappedBy = "movie",cascade = CascadeType.ALL)
    private List<Review> reviewList = new ArrayList<>();

    @OneToMany(mappedBy = "movie",cascade = CascadeType.ALL)
    private List<MoviePlayList> moviePlayListList = new ArrayList<>();
}