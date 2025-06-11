package deu.movietalk.controller;

import deu.movietalk.domain.Member;
import deu.movietalk.jwt.JWTUtil;
import deu.movietalk.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthStatusController {

    private final JWTUtil jwtUtil;
    private final MemberRepository memberRepository;
    public AuthStatusController(JWTUtil jwtUtil, MemberRepository memberRepository) {
        this.jwtUtil = jwtUtil;
        this.memberRepository = memberRepository;
    }

    @PostMapping("/api/user/set-nickname")
    public ResponseEntity<?> setNickname(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String newNickname = body.get("nickname");
        if (newNickname == null || newNickname.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "닉네임은 필수 입력값입니다."));
        }
        newNickname = newNickname.trim();

        // 1) 요청에서 JWT 토큰 추출 (쿠키 또는 헤더에서)
        String token = null;
        // 헤더에서 Authorization: Bearer {token} 추출
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else if (request.getCookies() != null) { // 쿠키에서 찾기
            for (var cookie : request.getCookies()) {
                if ("Authorization".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null || jwtUtil.isExpired(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "유효하지 않은 토큰입니다."));
        }

        // 2) 토큰에서 사용자 ID(회원ID) 추출
        String userId = jwtUtil.getUsername(token);

        // 3) 닉네임 중복 검사
        if (memberRepository.existsByNickname(newNickname)) {
            return ResponseEntity.badRequest().body(Map.of("error", "닉네임이 이미 사용중입니다."));
        }

        // 4) 회원 정보 조회 및 닉네임 업데이트
        Member member = memberRepository.findByMemberId(userId);
        if (member == null) {
            return ResponseEntity.status(404).body(Map.of("error", "회원 정보를 찾을 수 없습니다."));
        }
        member.setNickname(newNickname);
        memberRepository.save(member);

        // 5) 성공 응답
        return ResponseEntity.ok(Map.of("message", "닉네임이 성공적으로 변경되었습니다."));
    }


    @GetMapping("/api/auth/status")
    public ResponseEntity<?> checkAuthStatus(HttpServletRequest request) {
        try {
            String token = null;
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            } else if (request.getCookies() != null) {
                for (var cookie : request.getCookies()) {
                    if ("Authorization".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }

            if (token == null || jwtUtil.isExpired(token)) {
                return ResponseEntity.status(401).body(Map.of("isLoggedIn", false, "nickname", ""));
            }

            String username = jwtUtil.getUsername(token);
            Member member = memberRepository.findByMemberId(username);
            String nickname = (member != null && member.getNickname() != null) ? member.getNickname() : "";

            return ResponseEntity.ok(Map.of("isLoggedIn", true, "nickname", nickname));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("isLoggedIn", false, "nickname", ""));
        }
    }


    // 응답 DTO
    public static class AuthStatusResponse {
        private boolean isLoggedIn;
        private String nickname;

        public AuthStatusResponse(boolean isLoggedIn, String nickname) {
            this.isLoggedIn = isLoggedIn;
            this.nickname = nickname;
        }
        public boolean getIsLoggedIn() { return isLoggedIn; }
        public String getNickname() { return nickname; }
    }
}