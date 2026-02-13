package com.yao.blog.controller;

import com.yao.blog.dto.response.ArchiveResponse;
import com.yao.blog.dto.response.BlogResponse;
import com.yao.blog.dto.response.BlogSummaryResponse;
import com.yao.blog.service.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
@Tag(name = "Blogs (Public)", description = "Public blog endpoints")
public class BlogController {

    private final BlogService blogService;

    @GetMapping
    @Operation(summary = "List published blogs with pagination")
    public ResponseEntity<Page<BlogSummaryResponse>> listBlogs(
            @PageableDefault(size = 8, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(blogService.listPublishedBlogs(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get blog detail with HTML content")
    public ResponseEntity<BlogResponse> getBlog(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlogAndConvert(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search blogs by keyword")
    public ResponseEntity<Page<BlogSummaryResponse>> searchBlogs(
            @RequestParam String query,
            @PageableDefault(size = 8, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(blogService.searchBlogs(query, pageable));
    }

    @GetMapping("/recommend")
    @Operation(summary = "Get recommended blogs")
    public ResponseEntity<List<BlogSummaryResponse>> getRecommendBlogs(
            @RequestParam(defaultValue = "8") int size) {
        return ResponseEntity.ok(blogService.listRecommendBlogs(size));
    }

    @GetMapping("/type/{typeId}")
    @Operation(summary = "List blogs by type")
    public ResponseEntity<Page<BlogSummaryResponse>> listBlogsByType(
            @PathVariable Long typeId,
            @PageableDefault(size = 8, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(blogService.listBlogsByType(typeId, pageable));
    }

    @GetMapping("/tag/{tagId}")
    @Operation(summary = "List blogs by tag")
    public ResponseEntity<Page<BlogSummaryResponse>> listBlogsByTag(
            @PathVariable Long tagId,
            @PageableDefault(size = 8, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(blogService.listBlogsByTag(tagId, pageable));
    }

    @GetMapping("/archive")
    @Operation(summary = "Get blog archives grouped by year")
    public ResponseEntity<List<ArchiveResponse>> getArchives() {
        return ResponseEntity.ok(blogService.getArchives());
    }

    @GetMapping("/count")
    @Operation(summary = "Get total blog count")
    public ResponseEntity<Long> countBlogs() {
        return ResponseEntity.ok(blogService.countBlogs());
    }
}
