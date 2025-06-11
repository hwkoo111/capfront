package deu.movietalk.service;

import deu.movietalk.domain.Member;
import deu.movietalk.dto.CustomMemberDetails;
import deu.movietalk.repository.MemberRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomMemberDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    public CustomMemberDetailsService(MemberRepository memberRepository) {

        this.memberRepository = memberRepository;
    }
    //로그인 요청은 form-data 형식으로
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Member member = memberRepository.findByMemberId(username);

        if (member != null) {

            //UserDetails에 담아서 return하면 AutneticationManager가 검증 함
            return new CustomMemberDetails(member);
        }
        return null;
    }
}