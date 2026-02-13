package com.yao.blog.service;

import com.yao.blog.dto.request.TypeRequest;
import com.yao.blog.dto.response.TypeResponse;
import com.yao.blog.entity.Type;
import com.yao.blog.exception.DuplicateResourceException;
import com.yao.blog.exception.ResourceNotFoundException;
import com.yao.blog.repository.TypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TypeServiceTest {

    @Mock
    private TypeRepository typeRepository;

    @InjectMocks
    private TypeService typeService;

    @Test
    void createType_success() {
        TypeRequest request = new TypeRequest();
        request.setName("Java");

        Type saved = Type.builder().name("Java").build();
        saved.setId(1L);
        saved.setBlogs(new ArrayList<>());

        when(typeRepository.findByNameAndDeletedFalse("Java")).thenReturn(Optional.empty());
        when(typeRepository.save(any(Type.class))).thenReturn(saved);

        TypeResponse response = typeService.createType(request);

        assertEquals("Java", response.getName());
        assertEquals(1L, response.getId());
        verify(typeRepository).save(any(Type.class));
    }

    @Test
    void createType_duplicate_throwsException() {
        TypeRequest request = new TypeRequest();
        request.setName("Java");

        when(typeRepository.findByNameAndDeletedFalse("Java"))
                .thenReturn(Optional.of(Type.builder().name("Java").build()));

        assertThrows(DuplicateResourceException.class, () -> typeService.createType(request));
    }

    @Test
    void getType_notFound_throwsException() {
        when(typeRepository.findByIdAndDeletedFalse(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> typeService.getType(999L));
    }

    @Test
    void deleteType_success() {
        Type type = Type.builder().name("Java").build();
        type.setId(1L);

        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("admin");
        SecurityContextHolder.setContext(securityContext);

        when(typeRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(type));
        when(typeRepository.save(any(Type.class))).thenReturn(type);

        typeService.deleteType(1L);

        assertTrue(type.isDeleted());
        assertNotNull(type.getDeletedAt());
        assertEquals("admin", type.getDeletedBy());
    }
}
