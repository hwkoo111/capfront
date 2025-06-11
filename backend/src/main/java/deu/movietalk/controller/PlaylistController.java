package deu.movietalk.controller;

import deu.movietalk.dto.*;
import deu.movietalk.repository.MovieRepository;
import deu.movietalk.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/playlist")
public class PlaylistController {
    private final PlaylistService playlistService;

    @GetMapping ("/view")
    public List<PlayListViewDto> showPlaylistPage() {
        return playlistService.getPlaylistViews();
    }

    //DB 검색 - 영화 찾기
    @GetMapping("/enter/search")
    public ResponseEntity<List<MovieSearchSummaryDto>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(playlistService.searchMovies(keyword));
    }

    // 찾은 영화 + 버튼으로 메모리에 임시 저장 -> 리스트 형태로 제작
    @PostMapping("/enter/search/add")
    public ResponseEntity<String> addMovie(@RequestParam Long movieId, Authentication authentication) {
        String memberId = authentication.getName(); // JWT에서 추출된 사용자 ID
        playlistService.addMovieToSelection(memberId, movieId);
        return ResponseEntity.ok("영화가 선택 목록에 추가되었습니다.");
    }

    // 임시 저장된 영화 목록 반환
    @GetMapping("/enter/search/selection")  //프론트에서 movie_id 기반으로 영화명 나오게 해야 함
    public ResponseEntity<Set<Long>> getSelectedMovies(Authentication authentication) {
        String memberId = authentication.getName();
        Set<Long> selected = playlistService.getSelectedMovies(memberId);
        return ResponseEntity.ok(selected);
    }

    // 플레이리스트 생성 (메모리 저장된 영화 리스트로)
    @PostMapping("/enter/create")
    public ResponseEntity<String> createPlaylist(@RequestParam String name, Authentication authentication) {
        String memberId = authentication.getName();
        playlistService.createPlaylist(name, memberId);
        return ResponseEntity.ok("플레이리스트 생성 완료");
    }

    //플레이리스트 삭제
    @DeleteMapping("/enter/delete/{playListId}")
    public ResponseEntity<?> deletePlaylist(@PathVariable Long playListId, Authentication authentication) {
        try {
            String memberId = authentication.getName();
            playlistService.deletePlaylist(playListId, memberId);
            return ResponseEntity.ok("플레이리스트가 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류 발생");
        }
    }

    //플레이리스트 조회 - 상세 정보 표시
    @GetMapping("/view/{playListId}")
    public ResponseEntity<?> getPlaylistDetail(@PathVariable Long playListId) {
        try {
            PlayListDetailDto detailDto = playlistService.getPlaylistDetail(playListId);
            return ResponseEntity.ok(detailDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //플레이리스트 수정
    @PutMapping("/enter/put/{playListId}")
    public ResponseEntity<String> updatePlaylist(@PathVariable Long playListId,
                                                 @RequestBody PlayListUpdateRequestDto dto) {
        try {
            String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
            playlistService.updatePlaylist(playListId, memberId, dto);
            return ResponseEntity.ok("플레이리스트가 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("플레이리스트 수정 중 오류 발생");
        }
    }

    @GetMapping("/enter/put/movieList/{playListId}")
    public ResponseEntity<List<MovieSearchSummaryDto>> getPlaylistMoviesForEdit(@PathVariable Long playListId) {
        try {
            List<MovieSearchSummaryDto> movies = playlistService.getMoviesByPlaylistId(playListId);
            return ResponseEntity.ok(movies);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/myplaylist")
    public List<PlayListViewDto> getMyPlaylists(@AuthenticationPrincipal CustomMemberDetails userDetails) {
        if (userDetails == null || userDetails.getMember() == null) {
            System.out.println("❌ 인증된 사용자 정보가 없습니다. JWT가 유효하지 않거나 인증 실패.");
            return new ArrayList<>();  // 또는 401 Unauthorized 응답 처리도 가능
        }

        String username = userDetails.getMember().getMemberId();
        System.out.println("✅ 인증된 사용자 Id: " + username);  // JWT에서 추출된 닉네임 확인용 로그
        return playlistService.getPlaylistsByUsername(username);
    }



}
