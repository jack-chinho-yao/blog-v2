package com.yao.blog.service;

import com.yao.blog.dto.request.BlogRequest;
import com.yao.blog.dto.response.ArchiveResponse;
import com.yao.blog.dto.response.BlogResponse;
import com.yao.blog.dto.response.BlogSummaryResponse;
import com.yao.blog.dto.response.TagResponse;
import com.yao.blog.dto.response.TypeResponse;
import com.yao.blog.dto.response.UserResponse;
import com.yao.blog.entity.Blog;
import com.yao.blog.entity.Tag;
import com.yao.blog.entity.Type;
import com.yao.blog.entity.User;
import com.yao.blog.exception.ResourceNotFoundException;
import com.yao.blog.repository.BlogRepository;
import com.yao.blog.repository.TagRepository;
import com.yao.blog.repository.TypeRepository;
import com.yao.blog.repository.UserRepository;
import com.yao.blog.security.CustomUserDetails;
import com.yao.blog.util.MarkdownUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final TypeRepository typeRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<BlogSummaryResponse> listPublishedBlogs(Pageable pageable) {
        return blogRepository.findByDeletedFalse(pageable)
                .map(this::toBlogSummaryResponse);
    }

    @Transactional(readOnly = true)
    public BlogResponse getBlog(Long id) {
        Blog blog = blogRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", id));
        return toBlogResponse(blog);
    }

    @Transactional
    public BlogResponse getBlogAndConvert(Long id) {
        Blog blog = blogRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", id));
        blogRepository.incrementViews(id);
        BlogResponse response = toBlogResponse(blog);
        response.setContent(MarkdownUtils.markdownToHtml(blog.getContent()));
        response.setViews(blog.getViews() + 1);
        return response;
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryResponse> searchBlogs(String query, Pageable pageable) {
        return blogRepository.findByQuery("%" + query + "%", pageable)
                .map(this::toBlogSummaryResponse);
    }

    @Transactional(readOnly = true)
    public List<BlogSummaryResponse> listRecommendBlogs(int size) {
        return blogRepository.findRecommendBlogs(PageRequest.of(0, size))
                .stream()
                .map(this::toBlogSummaryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryResponse> listBlogsByType(Long typeId, Pageable pageable) {
        return blogRepository.findByTypeId(typeId, pageable)
                .map(this::toBlogSummaryResponse);
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryResponse> listBlogsByTag(Long tagId, Pageable pageable) {
        return blogRepository.findByTagId(tagId, pageable)
                .map(this::toBlogSummaryResponse);
    }

    @Transactional(readOnly = true)
    public List<ArchiveResponse> getArchives() {
        List<Integer> years = blogRepository.findArchiveYears();
        List<ArchiveResponse> archives = new ArrayList<>();
        for (Integer year : years) {
            List<BlogSummaryResponse> blogs = blogRepository.findByYear(year)
                    .stream()
                    .map(this::toBlogSummaryResponse)
                    .collect(Collectors.toList());
            archives.add(ArchiveResponse.builder().year(year).blogs(blogs).build());
        }
        return archives;
    }

    @Transactional(readOnly = true)
    public long countBlogs() {
        return blogRepository.countByDeletedFalse();
    }

    @Transactional
    public BlogResponse createBlog(BlogRequest request) {
        Blog blog = new Blog();
        populateBlog(blog, request);
        blog.setUser(getCurrentUser());
        setDescription(blog, request);
        Blog saved = blogRepository.save(blog);
        return toBlogResponse(saved);
    }

    @Transactional
    public BlogResponse updateBlog(Long id, BlogRequest request) {
        Blog blog = blogRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", id));
        populateBlog(blog, request);
        setDescription(blog, request);
        Blog saved = blogRepository.save(blog);
        return toBlogResponse(saved);
    }

    @Transactional
    public void deleteBlog(Long id) {
        Blog blog = blogRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", id));
        blog.setDeleted(true);
        blog.setDeletedAt(LocalDateTime.now());
        blog.setDeletedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        blogRepository.save(blog);
    }

    // Admin: list all blogs including drafts
    @Transactional(readOnly = true)
    public Page<BlogSummaryResponse> listAllBlogs(Pageable pageable) {
        return blogRepository.findByDeletedFalse(pageable)
                .map(this::toBlogSummaryResponse);
    }

    private void populateBlog(Blog blog, BlogRequest request) {
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setFirstPicture(request.getFirstPicture());
        blog.setFlag(request.getFlag());
        blog.setAppreciation(request.isAppreciation());
        blog.setShareStatement(request.isShareStatement());
        blog.setCommentable(request.isCommentable());
        blog.setPublished(request.isPublished());
        blog.setRecommend(request.isRecommend());

        Type type = typeRepository.findByIdAndDeletedFalse(request.getTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Type", request.getTypeId()));
        blog.setType(type);

        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            List<Tag> tags = request.getTagIds().stream()
                    .map(tagId -> tagRepository.findByIdAndDeletedFalse(tagId)
                            .orElseThrow(() -> new ResourceNotFoundException("Tag", tagId)))
                    .collect(Collectors.toList());
            blog.setTags(tags);
        }
    }

    private void setDescription(Blog blog, BlogRequest request) {
        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            blog.setDescription(request.getDescription());
        } else if (blog.getContent() != null && blog.getContent().length() > 100) {
            blog.setDescription(blog.getContent().substring(0, 100) + "...");
        } else {
            blog.setDescription(blog.getContent());
        }
    }

    private User getCurrentUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow();
    }

    private BlogResponse toBlogResponse(Blog blog) {
        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .content(blog.getContent())
                .firstPicture(blog.getFirstPicture())
                .flag(blog.getFlag())
                .description(blog.getDescription())
                .views(blog.getViews())
                .appreciation(blog.isAppreciation())
                .shareStatement(blog.isShareStatement())
                .commentable(blog.isCommentable())
                .published(blog.isPublished())
                .recommend(blog.isRecommend())
                .type(blog.getType() != null ? toTypeResponse(blog.getType()) : null)
                .tags(blog.getTags().stream().map(this::toTagResponse).collect(Collectors.toList()))
                .user(blog.getUser() != null ? toUserResponse(blog.getUser()) : null)
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .build();
    }

    private BlogSummaryResponse toBlogSummaryResponse(Blog blog) {
        return BlogSummaryResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .firstPicture(blog.getFirstPicture())
                .flag(blog.getFlag())
                .description(blog.getDescription())
                .views(blog.getViews())
                .recommend(blog.isRecommend())
                .type(blog.getType() != null ? toTypeResponse(blog.getType()) : null)
                .tags(blog.getTags().stream().map(this::toTagResponse).collect(Collectors.toList()))
                .user(blog.getUser() != null ? toUserResponse(blog.getUser()) : null)
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .build();
    }

    private TypeResponse toTypeResponse(Type type) {
        return TypeResponse.builder()
                .id(type.getId())
                .name(type.getName())
                .blogCount(type.getBlogs() != null ? type.getBlogs().stream().filter(b -> !b.isDeleted()).count() : 0)
                .build();
    }

    private TagResponse toTagResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .blogCount(tag.getBlogs() != null ? tag.getBlogs().stream().filter(b -> !b.isDeleted()).count() : 0)
                .build();
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .build();
    }
}
