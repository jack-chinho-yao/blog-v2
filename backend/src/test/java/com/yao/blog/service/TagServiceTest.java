package com.yao.blog.service;

import com.yao.blog.dto.request.TagRequest;
import com.yao.blog.dto.response.TagResponse;
import com.yao.blog.entity.Tag;
import com.yao.blog.exception.DuplicateResourceException;
import com.yao.blog.exception.ResourceNotFoundException;
import com.yao.blog.repository.TagRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TagServiceTest {

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private TagService tagService;

    @Test
    void createTag_success() {
        TagRequest request = new TagRequest();
        request.setName("Spring Boot");

        Tag saved = Tag.builder().name("Spring Boot").build();
        saved.setId(1L);
        saved.setBlogs(new ArrayList<>());

        when(tagRepository.findByNameAndDeletedFalse("Spring Boot")).thenReturn(Optional.empty());
        when(tagRepository.save(any(Tag.class))).thenReturn(saved);

        TagResponse response = tagService.createTag(request);

        assertEquals("Spring Boot", response.getName());
        verify(tagRepository).save(any(Tag.class));
    }

    @Test
    void createTag_duplicate_throwsException() {
        TagRequest request = new TagRequest();
        request.setName("Spring Boot");

        when(tagRepository.findByNameAndDeletedFalse("Spring Boot"))
                .thenReturn(Optional.of(Tag.builder().name("Spring Boot").build()));

        assertThrows(DuplicateResourceException.class, () -> tagService.createTag(request));
    }

    @Test
    void getTag_notFound_throwsException() {
        when(tagRepository.findByIdAndDeletedFalse(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tagService.getTag(999L));
    }
}
