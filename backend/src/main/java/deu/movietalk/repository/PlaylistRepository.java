package deu.movietalk.repository;


import deu.movietalk.domain.PlayList;
import deu.movietalk.dto.PlayListViewDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistRepository extends JpaRepository<PlayList, Long>{

    Optional<PlayList> findByPlayListIdAndMember_MemberId(Long playListId, String memberId);
    List<PlayList> findAllByMember_MemberId(String username);

}
