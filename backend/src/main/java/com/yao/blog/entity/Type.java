package com.yao.blog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "t_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Type extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "type")
    @Builder.Default
    private List<Blog> blogs = new ArrayList<>();
}
