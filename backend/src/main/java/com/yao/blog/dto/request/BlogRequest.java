package com.yao.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class BlogRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String firstPicture;

    private String flag;

    private String description;

    private List<Long> tagIds;

    private boolean appreciation;

    private boolean shareStatement;

    private boolean commentable;

    private boolean published;

    private boolean recommend;
}
