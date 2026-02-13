package com.yao.blog.repository;

import com.yao.blog.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findByIdAndDeletedFalse(Long id);

    Optional<Tag> findByNameAndDeletedFalse(String name);

    Page<Tag> findByDeletedFalse(Pageable pageable);

    List<Tag> findByDeletedFalse();

    @Query("SELECT t FROM Tag t LEFT JOIN t.blogs b WHERE t.deleted = false GROUP BY t.id ORDER BY COUNT(b) DESC")
    List<Tag> findTopTags(Pageable pageable);
}