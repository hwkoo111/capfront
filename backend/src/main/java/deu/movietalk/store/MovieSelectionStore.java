package deu.movietalk.store;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MovieSelectionStore {
    private final Map<String, Set<Long>> userMovieMap = new ConcurrentHashMap<>();

    public void addMovie(String memberId, Long movieId) {
        userMovieMap.computeIfAbsent(memberId, k -> new HashSet<>()).add(movieId);
    }

    public Set<Long> getMovies(String memberId) {
        return userMovieMap.getOrDefault(memberId, Collections.emptySet());
    }

    public void clear(String memberId) {
        userMovieMap.remove(memberId);
    }
}
