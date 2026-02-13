package com.yao.blog.service;

import com.yao.blog.dto.request.CommentRequest;
import com.yao.blog.dto.response.CommentResponse;
import com.yao.blog.entity.Blog;
import com.yao.blog.entity.Comment;
import com.yao.blog.exception.ResourceNotFoundException;
import com.yao.blog.repository.BlogRepository;
import com.yao.blog.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByBlogId(Long blogId) {
        List<Comment> topLevelComments = commentRepository
                .findByBlogIdAndParentCommentNullAndDeletedFalseOrderByCreatedAtDesc(blogId);
        return topLevelComments.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse createComment(CommentRequest request) {
        Blog blog = blogRepository.findByIdAndDeletedFalse(request.getBlogId())
                .orElseThrow(() -> new ResourceNotFoundException("Blog", request.getBlogId()));

        Comment comment = Comment.builder()
                .nickname(request.getNickname())
                .email(request.getEmail())
                .content(request.getContent())
                .blog(blog)
                .build();

        // Check if current user is admin
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            comment.setAdminComment(true);
            comment.setAvatar("/images/admin-avatar.png");
        } else {
            comment.setAvatar("/images/default-avatar.png");
        }

        if (request.getParentCommentId() != null) {
            Comment parent = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment", request.getParentCommentId()));
            comment.setParentComment(parent);
        }

        Comment saved = commentRepository.save(comment);
        return toResponse(saved);
    }

    @Transactional
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
        comment.setDeleted(true);
        comment.setDeletedAt(LocalDateTime.now());
        comment.setDeletedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        commentRepository.save(comment);
    }

    private CommentResponse toResponse(Comment comment) {
        List<CommentResponse> replies = comment.getReplies() != null
                ? comment.getReplies().stream()
                    .filter(r -> !r.isDeleted())
                    .map(this::toResponse)
                    .collect(Collectors.toList())
                : List.of();

        return CommentResponse.builder()
                .id(comment.getId())
                .nickname(comment.getNickname())
                .email(comment.getEmail())
                .content(comment.getContent())
                .avatar(comment.getAvatar())
                .adminComment(comment.isAdminComment())
                .createdAt(comment.getCreatedAt())
                .replies(replies)
                .build();
    }
}
