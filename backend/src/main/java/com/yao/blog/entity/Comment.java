package com.yao.blog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "t_comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BaseEntity {

    @Column(nullable = false)
    private String nickname;

    private String email;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String avatar;

    @Column(nullable = false)
    @Builder.Default
    private boolean adminComment = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id")
    private Blog blog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment")
    @Builder.Default
    private List<Comment> replies = new ArrayList<>();
}
