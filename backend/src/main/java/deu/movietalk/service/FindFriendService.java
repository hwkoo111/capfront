package deu.movietalk.service;

import deu.movietalk.domain.Member;
import deu.movietalk.domain.MemberFavoriteMovie;
import deu.movietalk.dto.FindFriendMovieDto;
import deu.movietalk.dto.MoviePlaylistSummaryDto;
import deu.movietalk.dto.PlayListViewDto;
import deu.movietalk.repository.MemberFavoriteMovieRepository;
import deu.movietalk.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FindFriendService {
    private final MemberFavoriteMovieRepository memberFavoriteMovieRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public FindFriendMovieDto getFavoriteMovieDetail(String nickname) {
        Member member = memberRepository.findByNickname(nickname).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        List<MemberFavoriteMovie> favoriteMovies = memberFavoriteMovieRepository.findByMember_MemberId(member.getMemberId());

        List<MoviePlaylistSummaryDto> moviePlaylistSummaryDtos = favoriteMovies.stream()
                .map(favoriteMovie -> new MoviePlaylistSummaryDto(
                        favoriteMovie.getMovie().getMovieId(),
                        favoriteMovie.getMovie().getTitle(),
                        favoriteMovie.getMovie().getTitleEng(),
                        favoriteMovie.getMovie().getPosterUrl()))
                .collect(Collectors.toList());

        FindFriendMovieDto findFriendMovieDto = new FindFriendMovieDto();
        findFriendMovieDto.setNickname(member.getNickname());
        findFriendMovieDto.setMoviePlaylistSummaryDtos(moviePlaylistSummaryDtos);

        return findFriendMovieDto;


    }

}
