package com.yao.blog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class TagResponse {

    private Long id;
    private String name;
    private long blogCount;
}
