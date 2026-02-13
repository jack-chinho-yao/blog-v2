package com.yao.blog.util;

import org.commonmark.Extension;
import org.commonmark.ext.gfm.tables.TablesExtension;
import org.commonmark.ext.heading.anchor.HeadingAnchorExtension;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

import java.util.List;

public final class MarkdownUtils {

    private MarkdownUtils() {}

    public static String markdownToHtml(String markdown) {
        if (markdown == null || markdown.isBlank()) {
            return "";
        }

        List<Extension> extensions = List.of(
                TablesExtension.create(),
                HeadingAnchorExtension.create()
        );

        Parser parser = Parser.builder()
                .extensions(extensions)
                .build();

        Node document = parser.parse(markdown);

        HtmlRenderer renderer = HtmlRenderer.builder()
                .extensions(extensions)
                .build();

        return renderer.render(document);
    }
}
