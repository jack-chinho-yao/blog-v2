package com.yao.blog.controller;

import com.yao.blog.dto.response.TypeResponse;
import com.yao.blog.service.TypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/types")
@RequiredArgsConstructor
@Tag(name = "Types (Public)", description = "Public type/category endpoints")
public class TypeController {

    private final TypeService typeService;

    @GetMapping
    @Operation(summary = "List all types")
    public ResponseEntity<List<TypeResponse>> listTypes() {
        return ResponseEntity.ok(typeService.listAllTypes());
    }

    @GetMapping("/top")
    @Operation(summary = "Get top types by blog count")
    public ResponseEntity<List<TypeResponse>> getTopTypes(@RequestParam(defaultValue = "6") int size) {
        return ResponseEntity.ok(typeService.listTopTypes(size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get type by ID")
    public ResponseEntity<TypeResponse> getType(@PathVariable Long id) {
        return ResponseEntity.ok(typeService.getType(id));
    }
}
