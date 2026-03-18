package com.yao.blog.controller;

import com.yao.blog.dto.request.BlogRequest;
import com.yao.blog.dto.response.BlogResponse;
import com.yao.blog.dto.response.BlogSummaryResponse;
import com.yao.blog.service.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/blogs")
@RequiredArgsConstructor
@Tag(name = "Admin - Blogs", description = "Blog management (requires authentication)")
public class AdminBlogController {

    private final BlogService blogService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTHOR')")
    @Operation(summary = "List all blogs (including drafts)")
    public ResponseEntity<Page<BlogSummaryResponse>> listBlogs(
            @PageableDefault(size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(blogService.listAllBlogs(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTHOR')")
    @Operation(summary = "Get blog detail for editing")
    public ResponseEntity<BlogResponse> getBlog(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlog(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTHOR')")
    @Operation(summary = "Create a new blog")
    public ResponseEntity<BlogResponse> createBlog(@Valid @RequestBody BlogRequest request) {
        return ResponseEntity.ok(blogService.createBlog(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTHOR')")
    @Operation(summary = "Update a blog")
    public ResponseEntity<BlogResponse> updateBlog(@PathVariable Long id, @Valid @RequestBody BlogRequest request) {
        return ResponseEntity.ok(blogService.updateBlog(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a blog (ADMIN only)")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok().build();
    }
}
