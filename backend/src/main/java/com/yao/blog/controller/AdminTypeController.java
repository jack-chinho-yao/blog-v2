package com.yao.blog.controller;

import com.yao.blog.dto.request.TypeRequest;
import com.yao.blog.dto.response.TypeResponse;
import com.yao.blog.service.TypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/types")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'AUTHOR')")
@Tag(name = "Admin - Types", description = "Type management (requires authentication)")
public class AdminTypeController {

    private final TypeService typeService;

    @PostMapping
    @Operation(summary = "Create a new type")
    public ResponseEntity<TypeResponse> createType(@Valid @RequestBody TypeRequest request) {
        return ResponseEntity.ok(typeService.createType(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a type")
    public ResponseEntity<TypeResponse> updateType(@PathVariable Long id, @Valid @RequestBody TypeRequest request) {
        return ResponseEntity.ok(typeService.updateType(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a type (ADMIN only)")
    public ResponseEntity<Void> deleteType(@PathVariable Long id) {
        typeService.deleteType(id);
        return ResponseEntity.ok().build();
    }
}
