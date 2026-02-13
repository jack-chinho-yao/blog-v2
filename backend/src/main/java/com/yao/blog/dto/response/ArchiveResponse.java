package com.yao.blog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class ArchiveResponse {

    private Integer year;
    private List<BlogSummaryResponse> blogs;
}
