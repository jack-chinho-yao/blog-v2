package com.yao.blog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class BlogSummaryResponse {

    private Long id;
    private String title;
    private String firstPicture;
    private String flag;
    private String description;
    private Integer views;
    private boolean recommend;
    private TypeResponse type;
    private List<TagResponse> tags;
    private UserResponse user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
