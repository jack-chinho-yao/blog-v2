package com.yao.blog.repository;

import com.yao.blog.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByBlogIdAndParentCommentNullAndDeletedFalseOrderByCreatedAtDesc(Long blogId);

    List<Comment> findByBlogIdAndDeletedFalseOrderByCreatedAtDesc(Long blogId);
}
