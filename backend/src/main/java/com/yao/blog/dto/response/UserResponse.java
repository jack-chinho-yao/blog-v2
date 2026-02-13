package com.yao.blog.dto.response;

import com.yao.blog.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String nickname;
    private String email;
    private String avatar;
    private Role role;
}
