package com.yao.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentRequest {

    @NotBlank(message = "Nickname is required")
    private String nickname;

    private String email;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Blog ID is required")
    private Long blogId;

    private Long parentCommentId;
}
