package deu.movietalk.controller;

import deu.movietalk.dto.FindFriendMovieDto;
import deu.movietalk.service.FindFriendService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/friend")
public class FindFriendController {

    private final FindFriendService findFriendService;

    // 즐겨찾기 영화 조회 API
    @GetMapping
    public ResponseEntity<?> getFavoriteMovieDetail(@RequestParam String nickname) {
        try {
            // 즐겨찾기 영화 상세 조회 서비스 호출
            FindFriendMovieDto findFriendMovieDto = findFriendService.getFavoriteMovieDetail(nickname);
            return ResponseEntity.ok(findFriendMovieDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("회원이 존재하지 않습니다."); // 잘못된 요청 처리
        } catch (Exception e) {
            return ResponseEntity.status(500).body("영화 조회 중 오류가 발생했습니다."); // 서버 오류 처리
        }
    }

}
