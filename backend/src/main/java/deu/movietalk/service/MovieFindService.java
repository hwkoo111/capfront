package deu.movietalk.service;

import deu.movietalk.domain.Movie;
import deu.movietalk.dto.MovieSearchListDto;
import deu.movietalk.dto.MovieSearchResponseDto;
import deu.movietalk.repository.MovieFindRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieFindService {

    private final MovieFindRepository movieRepository;

    public MovieFindService(MovieFindRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // 검색 결과용 간단 DTO 반환
    @Transactional(readOnly = true)
    public List<MovieSearchListDto> searchMoviesForList(String keyword) {
        return movieRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(MovieSearchListDto::new)
                .collect(Collectors.toList());
    }

    // 상세 정보 조회
    @Transactional(readOnly = true)
    public MovieSearchResponseDto findMovieDetail(Long movieId) {
        Optional<Movie> optionalMovie = movieRepository.findById(movieId);
        return optionalMovie.map(MovieSearchResponseDto::new).orElse(null);
    }
}