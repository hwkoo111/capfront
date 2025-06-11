package deu.movietalk.service;

import deu.movietalk.dto.MovieSearchResponseDto;

import java.util.List;
import java.util.Map;

public interface MovieService {
    Map<String, List<Map<String, Object>>> getMoviesForMainPage();
}
