package com.yao.blog.repository;

import com.yao.blog.entity.Type;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TypeRepository extends JpaRepository<Type, Long> {

    Optional<Type> findByIdAndDeletedFalse(Long id);

    Optional<Type> findByNameAndDeletedFalse(String name);

    Page<Type> findByDeletedFalse(Pageable pageable);

    List<Type> findByDeletedFalse();

    @Query("SELECT t FROM Type t LEFT JOIN t.blogs b WHERE t.deleted = false GROUP BY t.id ORDER BY COUNT(b) DESC")
    List<Type> findTopTypes(Pageable pageable);
}