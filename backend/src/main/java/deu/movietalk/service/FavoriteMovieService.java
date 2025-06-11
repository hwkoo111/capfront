package deu.movietalk.service;

import deu.movietalk.domain.*;
import deu.movietalk.dto.MovieSearchSummaryDto;
import deu.movietalk.dto.PlayListUpdateRequestDto;
import deu.movietalk.dto.UpdateFavoriteMovie;
import deu.movietalk.repository.MemberFavoriteMovieRepository;
import deu.movietalk.repository.MemberRepository;
import deu.movietalk.repository.MovieRepository;
import deu.movietalk.repository.PlaylistRepository;
import deu.movietalk.store.MovieSelectionStore;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FavoriteMovieService {

    private final MovieRepository movieRepository;
    private final MemberRepository memberRepository;
    private final MovieSelectionStore movieSelectionStore;
    private final MemberFavoriteMovieRepository memberFavoriteMovieRepository;



    //영화 등록
    @Transactional
    public void createFavoriteMovie(String memberId) {
        Set<Long> movieIds = movieSelectionStore.getMovies(memberId);

        if (movieIds.isEmpty()) {
            throw new IllegalArgumentException("선택된 영화가 없습니다.");
        }

        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) throw new IllegalArgumentException("존재하지 않는 회원입니다.");

        // 영화 리스트 가져오기
        List<Movie> movies = movieRepository.findAllById(movieIds);
        for (Movie movie : movies) {
            // MemberFavoriteMovie 객체 생성 후 저장
            MemberFavoriteMovie favoriteMovie = new MemberFavoriteMovie();
            favoriteMovie.setMember(member);
            favoriteMovie.setMovie(movie);
            memberFavoriteMovieRepository.save(favoriteMovie);
        }

    }

    //영화 수정
    @Transactional
    public void updateMovie(UpdateFavoriteMovie dto) {
        // 해당 memberId로 즐겨찾기 영화 목록 조회
        String memberId = dto.getMemberId();


        // 사용자 조회
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new IllegalArgumentException("회원 정보가 존재하지 않습니다.");
        }

        // 기존 최애 영화 목록 삭제
        List<MemberFavoriteMovie> existingFavorites = memberFavoriteMovieRepository.findByMember_MemberId(memberId);
        memberFavoriteMovieRepository.deleteAll(existingFavorites);

        memberFavoriteMovieRepository.flush(); //db에 즉시 반영

        // 새 영화 ID로 새로운 즐겨찾기 영화 등록
        List<MemberFavoriteMovie> newFavorites = dto.getMovieIds().stream()
                .map(movieId -> {
                    Movie movie = movieRepository.findById(movieId)
                            .orElseThrow(() -> new IllegalArgumentException("해당 영화가 존재하지 않습니다."));

                    MemberFavoriteMovie favorite = new MemberFavoriteMovie();
                    favorite.setMember(member);
                    favorite.setMovie(movie);
                    return favorite;
                })
                .collect(Collectors.toList());

        // 저장
        memberFavoriteMovieRepository.saveAll(newFavorites);
    }

    //영화 삭제
    @Transactional
    public void deleteFavoriteMovie(String memberId) {
        memberFavoriteMovieRepository.deleteByMember_MemberId(memberId);
    }

    @Transactional
    public List<MovieSearchSummaryDto> getFavoriteMovies(String nickname) {
        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 닉네임입니다."));

        List<MemberFavoriteMovie> favorites = memberFavoriteMovieRepository.findByMember_MemberId(member.getMemberId());

        return favorites.stream()
                .map(favorite -> {
                    Movie movie = favorite.getMovie();
                    return new MovieSearchSummaryDto(
                           movie.getMovieId(),
                            movie.getTitle(),
                            movie.getTitleEng(),
                            movie.getCreateDts(),
                            movie.getGenre(),
                            movie.getPlot()
                    );
                })
                .collect(Collectors.toList());
    }

    public String getMemberIdByNickname(String nickname) {
        return memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("해당 닉네임의 사용자를 찾을 수 없습니다."))
                .getMemberId();
    }


}
