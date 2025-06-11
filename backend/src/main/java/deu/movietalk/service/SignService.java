package deu.movietalk.service;

import deu.movietalk.domain.Member;
import deu.movietalk.dto.SignUpDto;
import deu.movietalk.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SignService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public SignService(MemberRepository memberRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.memberRepository = memberRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }


    @Transactional
    public void SignUp(SignUpDto signUpDto) {
        if (signUpDto.getId() == null || signUpDto.getId().isBlank()) {
            throw new IllegalArgumentException("아이디는 필수입니다.");
        }

        if (signUpDto.getPassword() == null || signUpDto.getPassword().isBlank()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다.");
        }

        if (signUpDto.getNickname() == null || signUpDto.getNickname().isBlank()) {
            throw new IllegalArgumentException("닉네임은 필수입니다.");
        }

        if (memberRepository.existsById(signUpDto.getId())) {
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다.");
        }

        if (memberRepository.existsByNickname(signUpDto.getNickname())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }
        if (memberRepository.existsByEmail(signUpDto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        Member member = Member.builder()
                .memberId(signUpDto.getId())
                .email(signUpDto.getEmail())
                .nickname(signUpDto.getNickname())
                .role("ROLE_USER")
                .password(bCryptPasswordEncoder.encode(signUpDto.getPassword()))
                .build();

        memberRepository.save(member);
    }
}