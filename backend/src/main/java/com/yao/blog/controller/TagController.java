package com.yao.blog.controller;

import com.yao.blog.dto.response.TagResponse;
import com.yao.blog.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@Tag(name = "Tags (Public)", description = "Public tag endpoints")
public class TagController {

    private final TagService tagService;

    @GetMapping
    @Operation(summary = "List all tags")
    public ResponseEntity<List<TagResponse>> listTags() {
        return ResponseEntity.ok(tagService.listAllTags());
    }

    @GetMapping("/top")
    @Operation(summary = "Get top tags by blog count")
    public ResponseEntity<List<TagResponse>> getTopTags(@RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(tagService.listTopTags(size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tag by ID")
    public ResponseEntity<TagResponse> getTag(@PathVariable Long id) {
        return ResponseEntity.ok(tagService.getTag(id));
    }
}
