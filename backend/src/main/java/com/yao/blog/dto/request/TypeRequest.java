package com.yao.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TypeRequest {

    @NotBlank(message = "Type name is required")
    private String name;
}
