package deu.movietalk.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "community_category")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CommunityCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name", nullable = false, length = 100)
    private String categoryName;

    @OneToMany(mappedBy = "communityCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommunityPost> posts = new ArrayList<>();
}