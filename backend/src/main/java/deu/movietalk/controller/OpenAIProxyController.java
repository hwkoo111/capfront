package deu.movietalk.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/chatgpt")
@CrossOrigin(origins = "http://localhost:3000") // 프론트와 포트 다르면 필요 (배포 시 도메인 제한 권장)
public class OpenAIProxyController {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @PostMapping
    public ResponseEntity<String> chatgptProxy(@RequestBody JsonNode body) {
        RestTemplate restTemplate = new RestTemplate();
        String openaiApiUrl = "https://api.openai.com/v1/chat/completions";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        JsonNode requestPayload = body.deepCopy();
        HttpEntity<JsonNode> entity = new HttpEntity<>(requestPayload, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    openaiApiUrl, HttpMethod.POST, entity, String.class);

            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (Exception e) {
            // 로그에 예외를 출력
            e.printStackTrace();  // 예외 스택 트레이스를 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error in communication with OpenAI API");
        }
    }

}
