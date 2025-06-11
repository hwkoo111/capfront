package deu.movietalk.repository;

import deu.movietalk.domain.CommunityCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityCategoryRepository extends JpaRepository<CommunityCategory,Long> {
}
