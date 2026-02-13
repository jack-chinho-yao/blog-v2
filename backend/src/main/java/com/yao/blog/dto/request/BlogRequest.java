package com.yao.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "Type is required")
    private Long typeId;

    private List<Long> tagIds;

    private boolean appreciation;

    private boolean shareStatement;

    private boolean commentable;

    private boolean published;

    private boolean recommend;
}
