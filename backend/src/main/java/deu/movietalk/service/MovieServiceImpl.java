package deu.movietalk.service;

import deu.movietalk.domain.Movie;
import deu.movietalk.dto.MovieSearchResponseDto;
import deu.movietalk.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    @Override
    public Map<String, List<Map<String, Object>>> getMoviesForMainPage() {
        Map<String, List<Map<String, Object>>> result = new HashMap<>();

        // 오늘 날짜를 yyyyMMdd 문자열로 변환
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate today = LocalDate.now();


        List<Movie> recent = movieRepository
                .findTop100ByPosterUrlIsNotNullOrderByReleaseDtsDesc()
                .stream()
                .filter(m -> m.getReleaseDts() != null)
                .filter(m -> {
                    try {
                        LocalDate releaseDate = LocalDate.parse(m.getReleaseDts(), formatter);
                        return !releaseDate.isAfter(today);
                    } catch (Exception e) {
                        return false;
                    }
                })
                .limit(5)
                .collect(Collectors.toList());

        List<Movie> horror = movieRepository
                .findTop10ByGenreContainingIgnoreCaseAndPosterUrlIsNotNullOrderByReleaseDtsDesc("스릴러");

        List<Movie> action = movieRepository
                .findTop10ByGenreContainingIgnoreCaseAndPosterUrlIsNotNullOrderByReleaseDtsDesc("액션");
        List<Movie> drama = movieRepository
                .findTop10ByGenreContainingIgnoreCaseAndPosterUrlIsNotNullOrderByReleaseDtsDesc("드라마");
        
        result.put("상영작", toSimpleList(recent));
        result.put("호러", toSimpleList(horror.subList(0, Math.min(5, horror.size()))));
        result.put("드라마", toSimpleList(drama.subList(0, Math.min(5, drama.size()))));
        result.put("액션", toSimpleList(action.subList(0, Math.min(5, action.size()))));
        
        return result;
    }

    private List<Map<String, Object>> toSimpleList(List<Movie> movies) {
        return movies.stream().map(movie -> {
            Map<String, Object> map = new HashMap<>();
            map.put("title", movie.getTitle());
            map.put("posterUrl", movie.getPosterUrl());
            map.put("id", movie.getMovieId());
            return map;
        }).collect(Collectors.toList());
    }


}
