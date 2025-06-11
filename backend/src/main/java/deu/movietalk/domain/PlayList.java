package deu.movietalk.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="play_list")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlayList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="play_list_id")
    private Long playListId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name="play_list_name" ,nullable = false)
    private String playListName;

    @Column(name="play_list_date", nullable = false)
    private String playListDate;

    @OneToMany(mappedBy = "playList",cascade = CascadeType.ALL)
    private List<MoviePlayList> moviePlayListList = new ArrayList<>();
}
