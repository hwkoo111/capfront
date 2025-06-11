package deu.movietalk.service;

import deu.movietalk.domain.Member;
import deu.movietalk.dto.CustomOAuth2User;
import deu.movietalk.dto.NaverResponse;
import deu.movietalk.dto.OAuth2Response;
import deu.movietalk.dto.UserDTO;
import deu.movietalk.repository.MemberRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    public CustomOAuth2UserService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        System.out.println(oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else {

            return null;
        }

       //추후 작성
        // 리소스 서버에서 발급 받은 정보로 사용자를 특정할 아이디값을 만듬
        String username = oAuth2Response.getProvider()+" "+oAuth2Response.getProviderId();
        Member existData = memberRepository.findByMemberId(username);

        if (existData == null) {
            Member member = new Member();
            member.setMemberId(username);
            member.setEmail(oAuth2Response.getEmail());

            // 닉네임이 없거나 빈 문자열일 경우 null로 설정
            String nickname = oAuth2Response.getNickname();
            if (nickname == null || nickname.trim().isEmpty()) {
                nickname = null;  // 또는 임시 닉네임 설정 가능
            }
            member.setNickname(nickname);

            member.setRole("ROLE_USER");
            member.setPassword("{noop}social_login");
            memberRepository.save(member);

            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(username);
            userDTO.setNickname(nickname);
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole("ROLE_USER");

            return new CustomOAuth2User(userDTO);
        } else {
            existData.setEmail(oAuth2Response.getEmail());

            // 닉네임 업데이트도 조건부로 (필요하다면)
            String nickname = oAuth2Response.getNickname();
            if (nickname != null && !nickname.trim().isEmpty()) {
                existData.setNickname(nickname);
            }

            memberRepository.save(existData);

            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(username);
            userDTO.setNickname(existData.getNickname());
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole("ROLE_USER");

            return new CustomOAuth2User(userDTO);
        }





    }
}
