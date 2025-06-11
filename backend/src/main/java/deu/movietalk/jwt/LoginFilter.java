package deu.movietalk.jwt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import deu.movietalk.dto.CustomMemberDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    public LoginFilter(AuthenticationManager authenticationManager,JWTUtil jwtUtil ) {
        this.jwtUtil=jwtUtil;
        this.authenticationManager = authenticationManager;
        setFilterProcessesUrl("/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            // JSON Body에서 username과 password를 추출
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> authenticationData = objectMapper.readValue(request.getInputStream(), Map.class);

            String username = authenticationData.get("username");
            String password = authenticationData.get("password");

            System.out.println("username = " + username);
            System.out.println("password = " + password);

            // username과 password로 UsernamePasswordAuthenticationToken 생성
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

            // authenticationManager를 통해 인증 요청을 처리
            return authenticationManager.authenticate(authToken);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read the login credentials", e);
        }
    }

    //로그인 성공시 실행하는 메소드 (여기서 JWT를 발급하면 됨)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();

        String username = customMemberDetails.getUsername();
        String nickname = customMemberDetails.getNickname();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        GrantedAuthority auth = authorities.iterator().next();
        String role = auth.getAuthority();

        String token = jwtUtil.createJwt(username, nickname, role, 60 * 60 * 1000L); // 1시간 유효 JWT 생성

        // 쿠키 생성
        Cookie cookie = new Cookie("Authorization", token);
//        cookie.setHttpOnly(true);            // JS에서 쿠키 접근 불가 (보안)
        cookie.setPath("/");                  // 전체 경로에 적용
        cookie.setMaxAge(60 * 60);           // 1시간
        // cookie.setSecure(true);           // HTTPS 환경에서만 쿠키 전송 (운영 시 활성화 권장)
        response.addCookie(cookie);

        // JSON 응답 대신 간단한 성공 메시지 또는 200 OK 상태 반환
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"message\": \"로그인 성공\"}");
    }



    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        response.setStatus(401);
    }
}