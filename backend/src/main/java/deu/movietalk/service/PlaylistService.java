package deu.movietalk.service;

import deu.movietalk.domain.*;
import deu.movietalk.dto.*;
import deu.movietalk.repository.MemberRepository;
import deu.movietalk.repository.MoviePlayListRepository;
import deu.movietalk.repository.MovieRepository;
import deu.movietalk.repository.PlaylistRepository;
import deu.movietalk.store.MovieSelectionStore;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor  // 이걸 추가해야 final 필드 자동 주입
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final MemberRepository memberRepository;
    private final MovieRepository movieRepository;
    private final MoviePlayListRepository moviePlayListRepository;
    private final MovieSelectionStore movieSelectionStore;

    // 선택한 영화 메모리에 임시 저장
    public void addMovieToSelection(String memberId, Long movieId) {
        movieSelectionStore.addMovie(memberId, movieId);
    }


    // 플레이리스트 생성
    @Transactional
    public void createPlaylist(String name, String memberId) {
        Set<Long> movieIds = movieSelectionStore.getMovies(memberId);

        if (movieIds.isEmpty()) {
            throw new IllegalArgumentException("선택된 영화가 없습니다.");
        }

        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) throw new IllegalArgumentException("존재하지 않는 회원입니다.");

        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm:ss"));
        PlayList playList = new PlayList();
        playList.setPlayListName(name);
        playList.setMember(member);
        playList.setPlayListDate(now);
        playlistRepository.save(playList);

        List<Movie> movies = movieRepository.findAllById(movieIds);
        for (Movie movie : movies) {
            MoviePlayList mpl = new MoviePlayList();
            mpl.setMovie(movie);
            mpl.setPlayList(playList);
            moviePlayListRepository.save(mpl);
        }

        // 생성 완료 후 리스트 초기화
        movieSelectionStore.clear(memberId);
    }

    // 선택된 영화 확인
    public Set<Long> getSelectedMovies(String memberId) {
        return movieSelectionStore.getMovies(memberId);
    }

    //영화검색
    public List<MovieSearchSummaryDto> searchMovies(String rawKeyword) {
        String keywordWithoutSpaces = rawKeyword.replaceAll("\\s+", "");
        if (keywordWithoutSpaces.isEmpty()) {
            throw new IllegalArgumentException("검색어가 비어 있습니다.");
        }

        List<MovieSearchSummaryDto> results = movieRepository.searchByTitleIgnoreSpace(keywordWithoutSpaces);

        return results; // 비어있더라도 그대로 리턴 -> 200 코드
    }

    public List<PlayListViewDto> getPlaylistViews() {   // 최신순
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm:ss");

        return playlistRepository.findAll().stream()
                .sorted(Comparator.comparing((PlayList p) ->
                        LocalDateTime.parse(p.getPlayListDate(), formatter)).reversed())
                .map(p -> new PlayListViewDto(
                        p.getPlayListId(),  // playListId 추가
                        p.getPlayListName(),
                        p.getPlayListDate(),
                        p.getMember().getNickname()))
                .collect(Collectors.toList());
    }


    @Transactional
    public void deletePlaylist(Long playListId, String memberId) {
        PlayList playList = playlistRepository.findByPlayListIdAndMember_MemberId(playListId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("삭제 권한이 없거나 존재하지 않는 플레이리스트입니다."));

        moviePlayListRepository.deleteByPlayList_PlayListId(playListId);

        playlistRepository.delete(playList);
    }

    //플레이리스트 조회
    @Transactional
    public PlayListDetailDto getPlaylistDetail(Long playListId) {
        PlayList playList = playlistRepository.findById(playListId)
                .orElseThrow(() -> new IllegalArgumentException("해당 플레이리스트가 존재하지 않습니다."));

        String playlistName = playList.getPlayListName();
        String writerName = playList.getMember().getNickname(); // 닉네임으로 변경
        String createdAt = playList.getPlayListDate(); // 이미 "yyyy.MM.dd"로 저장돼 있다고 가정

        List<MoviePlaylistSummaryDto> movies = playList.getMoviePlayListList().stream()
                .map(mpl -> new MoviePlaylistSummaryDto(
                        mpl.getMovie().getMovieId(), mpl.getMovie().getTitle(), mpl.getMovie().getTitleEng(),
                        mpl.getMovie().getPosterUrl()))
                .toList();

        return new PlayListDetailDto(playlistName, writerName, createdAt, movies);
    }

    @Transactional
    public void updatePlaylist(Long playListId, String memberId, PlayListUpdateRequestDto dto) {
        PlayList playList = playlistRepository.findByPlayListIdAndMember_MemberId(playListId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("수정 권한이 없거나 존재하지 않는 플레이리스트입니다."));

        // 이름 수정
        playList.setPlayListName(dto.getNewName());

        // 기존 영화 목록 제거
        playList.getMoviePlayListList().clear();
        moviePlayListRepository.deleteByPlayList_PlayListId(playListId);

        // 새 영화 목록 추가
        List<MoviePlayList> newMovieList = dto.getMovieIdList().stream()
                .map(movieId -> {
                    Movie movie = movieRepository.findById(movieId)
                            .orElseThrow(() -> new IllegalArgumentException("영화 ID " + movieId + "가 존재하지 않습니다."));
                    return new MoviePlayList(null, playList, movie);
                })
                .toList();

        playList.getMoviePlayListList().addAll(newMovieList);
    }

    public List<MovieSearchSummaryDto> getMoviesByPlaylistId(Long playListId) {
        PlayList playlist = playlistRepository.findById(playListId)
                .orElseThrow(() -> new IllegalArgumentException("플레이리스트가 없습니다"));

        // 플레이리스트에 포함된 영화 엔티티 리스트
        List<Movie> movies = playlist.getMoviePlayListList().stream()
                .map(MoviePlayList::getMovie)
                .collect(Collectors.toList());

        // MovieSearchSummaryDto 변환 후 반환
        return movies.stream()
                .map(MovieSearchSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PlayListViewDto> getPlaylistsByUsername(String username) {
        List<PlayList> playlists = playlistRepository.findAllByMember_MemberId(username);
        return playlists.stream()
                .map(p -> new PlayListViewDto(
                        p.getPlayListId(),
                        p.getPlayListName(),
                        p.getPlayListDate(),
                        p.getMember().getNickname()
                ))
                .collect(Collectors.toList());
    }

    public List<MovieSearchSummaryDto> getMoviesByIds(Set<Long> ids) {
        return movieRepository.findAllById(ids).stream()
                .map(movie -> new MovieSearchSummaryDto(
                        movie.getMovieId(),
                        movie.getTitle(),
                        movie.getTitleEng(),
                        movie.getCreateDts(),
                        movie.getGenre(),
                        movie.getPlot()
                ))
                .collect(Collectors.toList());
    }




}
