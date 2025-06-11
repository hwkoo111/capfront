package deu.movietalk.controller;

import deu.movietalk.dto.SignUpDto;
import deu.movietalk.service.SignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignController {

    private final SignService signService;

    @Autowired
    public SignController(SignService service) {
        this.signService = service;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> SignUp(@RequestBody SignUpDto signUpDto) {
        try {
            signService.SignUp(signUpDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류 발생");
        }
    }
}