package com.yao.blog.service;

import com.yao.blog.dto.request.TypeRequest;
import com.yao.blog.dto.response.TypeResponse;
import com.yao.blog.entity.Type;
import com.yao.blog.exception.DuplicateResourceException;
import com.yao.blog.exception.ResourceNotFoundException;
import com.yao.blog.repository.TypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TypeService {

    private final TypeRepository typeRepository;

    @Transactional(readOnly = true)
    public Page<TypeResponse> listTypes(Pageable pageable) {
        return typeRepository.findByDeletedFalse(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public List<TypeResponse> listAllTypes() {
        return typeRepository.findByDeletedFalse().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TypeResponse> listTopTypes(int size) {
        return typeRepository.findTopTypes(PageRequest.of(0, size)).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TypeResponse getType(Long id) {
        Type type = typeRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Type", id));
        return toResponse(type);
    }

    @Transactional
    public TypeResponse createType(TypeRequest request) {
        typeRepository.findByNameAndDeletedFalse(request.getName())
                .ifPresent(t -> { throw new DuplicateResourceException("Type already exists: " + request.getName()); });

        Type type = Type.builder().name(request.getName()).build();
        return toResponse(typeRepository.save(type));
    }

    @Transactional
    public TypeResponse updateType(Long id, TypeRequest request) {
        Type type = typeRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Type", id));

        typeRepository.findByNameAndDeletedFalse(request.getName())
                .filter(t -> !t.getId().equals(id))
                .ifPresent(t -> { throw new DuplicateResourceException("Type already exists: " + request.getName()); });

        type.setName(request.getName());
        return toResponse(typeRepository.save(type));
    }

    @Transactional
    public void deleteType(Long id) {
        Type type = typeRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Type", id));
        type.setDeleted(true);
        type.setDeletedAt(LocalDateTime.now());
        type.setDeletedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        typeRepository.save(type);
    }

    private TypeResponse toResponse(Type type) {
        return TypeResponse.builder()
                .id(type.getId())
                .name(type.getName())
                .blogCount(type.getBlogs() != null ? type.getBlogs().stream().filter(b -> !b.isDeleted()).count() : 0)
                .build();
    }
}
