package deu.movietalk.repository;

import deu.movietalk.domain.MoviePlayList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoviePlayListRepository extends JpaRepository<MoviePlayList, Long> {

    void deleteByPlayList_PlayListId(Long playListId);
}
