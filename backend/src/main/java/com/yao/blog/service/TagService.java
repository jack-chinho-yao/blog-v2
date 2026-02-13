package com.yao.blog.service;

import com.yao.blog.dto.request.TagRequest;
import com.yao.blog.dto.response.TagResponse;
import com.yao.blog.entity.Tag;
import com.yao.blog.exception.DuplicateResourceException;
import com.yao.blog.exception.ResourceNotFoundException;
import com.yao.blog.repository.TagRepository;
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
public class TagService {

    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public Page<TagResponse> listTags(Pageable pageable) {
        return tagRepository.findByDeletedFalse(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public List<TagResponse> listAllTags() {
        return tagRepository.findByDeletedFalse().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TagResponse> listTopTags(int size) {
        return tagRepository.findTopTags(PageRequest.of(0, size)).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TagResponse getTag(Long id) {
        Tag tag = tagRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", id));
        return toResponse(tag);
    }

    @Transactional
    public TagResponse createTag(TagRequest request) {
        tagRepository.findByNameAndDeletedFalse(request.getName())
                .ifPresent(t -> { throw new DuplicateResourceException("Tag already exists: " + request.getName()); });

        Tag tag = Tag.builder().name(request.getName()).build();
        return toResponse(tagRepository.save(tag));
    }

    @Transactional
    public TagResponse updateTag(Long id, TagRequest request) {
        Tag tag = tagRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", id));

        tagRepository.findByNameAndDeletedFalse(request.getName())
                .filter(t -> !t.getId().equals(id))
                .ifPresent(t -> { throw new DuplicateResourceException("Tag already exists: " + request.getName()); });

        tag.setName(request.getName());
        return toResponse(tagRepository.save(tag));
    }

    @Transactional
    public void deleteTag(Long id) {
        Tag tag = tagRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", id));
        tag.setDeleted(true);
        tag.setDeletedAt(LocalDateTime.now());
        tag.setDeletedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        tagRepository.save(tag);
    }

    private TagResponse toResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .blogCount(tag.getBlogs() != null ? tag.getBlogs().stream().filter(b -> !b.isDeleted()).count() : 0)
                .build();
    }
}
