package deu.movietalk.controller;

import deu.movietalk.dto.MovieSearchListDto;
import deu.movietalk.dto.MovieSearchResponseDto;
import deu.movietalk.service.MovieFindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movie")
@RequiredArgsConstructor
public class MovieFindController {

    private final MovieFindService movieService;

    // 간단 검색 결과 (movieId, title, posterUrl)
    @GetMapping("/search")
    public ResponseEntity<List<MovieSearchListDto>> searchMovies(@RequestParam String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(List.of());
        }
        return ResponseEntity.ok(movieService.searchMoviesForList(keyword.trim()));
    }

    // 상세 영화 조회 (MovieSearchResponseDto)
    @GetMapping("/search/{movieId}")
    public ResponseEntity<MovieSearchResponseDto> getMovieDetail(@PathVariable Long movieId) {
        MovieSearchResponseDto dto = movieService.findMovieDetail(movieId);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }



}
