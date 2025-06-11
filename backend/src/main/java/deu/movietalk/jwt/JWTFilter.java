package deu.movietalk.jwt;

import deu.movietalk.domain.Member;
import deu.movietalk.dto.CustomMemberDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.logging.Logger;  // 로그 추가를 위한 import

public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private static final Logger logger = Logger.getLogger(JWTFilter.class.getName());  // Logger 초기화

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.equals("/login") || path.equals("/signup") || path.equals("/api/friend")
                || path.startsWith("/api/movie") || path.startsWith("/api/playlist/view") || path.startsWith(("/api/community/posts"))
                || path.equals("/api/reviews/view") || path.equals("/api/chatgpt") || path.startsWith("/api/reviews/movie");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = null;
        String authorization = request.getHeader("Authorization");

        // 로그: Authorization 헤더에서 토큰 추출
        if (authorization != null && authorization.startsWith("Bearer ")) {
            token = authorization.substring(7);
            logger.info("JWT Token from Authorization header: " + token);  // 로그 출력
        } else {
            // 쿠키에서 JWT 찾기
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if ("Authorization".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
        }

        if (token == null) {
            logger.warning("No JWT token found in Authorization header or cookies.");  // 로그 출력
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\": \"로그인이 필요합니다.\"}");
            return;
        }

        try {
            // 토큰 만료 여부 체크
            if (jwtUtil.isExpired(token)) {
                logger.warning("JWT token is expired.");  // 로그 출력
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\": \"토큰이 만료되었습니다. 다시 로그인 해주세요.\"}");
                return;
            }

            // 토큰에서 username과 role, nickname 추출
            String username = jwtUtil.getUsername(token);
            String role = jwtUtil.getRole(token);
            String nickname = jwtUtil.getNickname(token);

            logger.info("Extracted username: " + username);  // 로그 출력
            logger.info("Extracted role: " + role);  // 로그 출력
            logger.info("Extracted nickname: " + nickname); // ✅ 로그 찍기

            // Member 객체 생성
            Member member = new Member();
            member.setMemberId(username);
            member.setPassword("temppassword");  // 패스워드는 사용하지 않기 때문에 임시값 설정
            member.setRole(role);
            member.setNickname(nickname);

            // CustomMemberDetails 객체 생성
            CustomMemberDetails customUserDetails = new CustomMemberDetails(member);
            Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authToken);

        } catch (Exception e) {
            logger.severe("Error while processing JWT token: " + e.getMessage());  // 로그 출력
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\": \"유효하지 않은 토큰입니다. 다시 로그인 해주세요.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
