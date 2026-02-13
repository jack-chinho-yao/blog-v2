package com.yao.blog.controller;

import com.yao.blog.dto.request.CommentRequest;
import com.yao.blog.dto.response.CommentResponse;
import com.yao.blog.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Comment endpoints")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/blog/{blogId}")
    @Operation(summary = "Get comments for a blog")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long blogId) {
        return ResponseEntity.ok(commentService.getCommentsByBlogId(blogId));
    }

    @PostMapping
    @Operation(summary = "Create a new comment")
    public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.createComment(request));
    }
}
