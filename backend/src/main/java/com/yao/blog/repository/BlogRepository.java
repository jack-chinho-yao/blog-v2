package com.yao.blog.repository;

import com.yao.blog.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long>, JpaSpecificationExecutor<Blog> {

    Optional<Blog> findByIdAndDeletedFalse(Long id);

    Page<Blog> findByDeletedFalse(Pageable pageable);

    @Query("SELECT b FROM Blog b WHERE b.deleted = false AND b.published = true AND (b.title LIKE :query OR b.content LIKE :query)")
    Page<Blog> findByQuery(@Param("query") String query, Pageable pageable);

    @Query("SELECT b FROM Blog b WHERE b.deleted = false AND b.published = true AND b.recommend = true ORDER BY b.updatedAt DESC")
    List<Blog> findRecommendBlogs(Pageable pageable);

    @Query("SELECT b FROM Blog b WHERE b.deleted = false AND b.published = true AND b.type.id = :typeId")
    Page<Blog> findByTypeId(@Param("typeId") Long typeId, Pageable pageable);

    @Query("SELECT b FROM Blog b JOIN b.tags t WHERE b.deleted = false AND b.published = true AND t.id = :tagId")
    Page<Blog> findByTagId(@Param("tagId") Long tagId, Pageable pageable);

    @Query("SELECT FUNCTION('YEAR', b.createdAt) as year FROM Blog b WHERE b.deleted = false AND b.published = true GROUP BY FUNCTION('YEAR', b.createdAt) ORDER BY year DESC")
    List<Integer> findArchiveYears();

    @Query("SELECT b FROM Blog b WHERE b.deleted = false AND b.published = true AND FUNCTION('YEAR', b.createdAt) = :year ORDER BY b.createdAt DESC")
    List<Blog> findByYear(@Param("year") Integer year);

    @Modifying
    @Query("UPDATE Blog b SET b.views = b.views + 1 WHERE b.id = :id")
    void incrementViews(@Param("id") Long id);

    long countByDeletedFalse();
}